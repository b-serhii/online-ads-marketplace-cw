import os
import uuid
import shutil
from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from datetime import datetime
from app.models import Ad, User
from app.core.deps import get_current_user

from ..db import get_db

router = APIRouter(prefix="/ads", tags=["ads"])

class AdResponse(BaseModel):
    id: int
    title: str
    description: str
    price: float
    category: str
    image_url: Optional[str]
    user_id: int
    created_at: datetime

    author_name: Optional[str] = None
    author_avatar: Optional[str] = None
    author_phone: Optional[str] = None

    class Config:
        from_attributes = True

@router.get("/{ad_id}", response_model=AdResponse)
async def get_ad(ad_id: int, db: AsyncSession = Depends(get_db)):
    query = select(Ad, User).join(User, Ad.user_id == User.id).where(Ad.id == ad_id)
    result = await db.execute(query)
    row = result.first()

    if not row:
        raise HTTPException(status_code=404, detail="Оголошення не знайдено")

    ad, user = row

    return {
        "id": ad.id,
        "title": ad.title,
        "description": ad.description,
        "price": ad.price,
        "category": ad.category,
        "image_url": ad.image_url,
        "user_id": ad.user_id,
        "created_at": ad.created_at,
        "author_name": user.name,
        "author_avatar": getattr(user, 'avatar', None),
        "author_phone": getattr(user, 'phone', None)
    }


@router.get("/my/all", response_model=List[AdResponse])
async def get_my_ads(
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    query = select(Ad).where(Ad.user_id == current_user.id).order_by(Ad.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/", response_model=AdResponse)
async def create_ad(
        title: str = Form(...),
        description: str = Form(...),
        price: float = Form(...),
        category: str = Form(...),
        file: Optional[UploadFile] = File(None),
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    image_path = None

    if file:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Файл має бути зображенням")

        UPLOAD_DIR = "uploads/ads"
        if not os.path.exists(UPLOAD_DIR):
            os.makedirs(UPLOAD_DIR)

        file_extension = file.filename.split(".")[-1]
        new_filename = f"{uuid.uuid4()}.{file_extension}"
        full_path = os.path.join(UPLOAD_DIR, new_filename)

        with open(full_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        image_path = f"/uploads/ads/{new_filename}"

    new_ad = Ad(
        title=title,
        description=description,
        price=price,
        category=category,
        image_url=image_path,
        user_id=current_user.id
    )

    db.add(new_ad)
    await db.commit()
    await db.refresh(new_ad)
    return new_ad


@router.get("/", response_model=List[AdResponse])
async def get_ads(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Ad).where(Ad.is_active == True).order_by(Ad.created_at.desc()))
    return result.scalars().all()