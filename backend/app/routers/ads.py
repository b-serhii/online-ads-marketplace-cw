import cloudinary.uploader
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


# ------------------- RESPONSE -------------------

class AdResponse(BaseModel):
    id: int
    title: str
    description: str
    price: float
    category: str

    image_url: Optional[str]
    images_urls: List[str] = []

    user_id: int
    created_at: datetime

    author_name: Optional[str]
    author_avatar: Optional[str]
    author_phone: Optional[str]

    class Config:
        from_attributes = True


def build_ad_response(ad: Ad, user: User):
    return {
        **ad.__dict__,
        "images_urls": ad.images_urls or [],
        "author_name": user.name,
        "author_avatar": user.avatar,
        "author_phone": user.phone
    }


# ------------------- GET ONE -------------------

@router.get("/{ad_id}", response_model=AdResponse)
async def get_ad(ad_id: int, db: AsyncSession = Depends(get_db)):
    query = select(Ad, User).join(User, Ad.user_id == User.id).where(Ad.id == ad_id)
    result = await db.execute(query)
    row = result.first()

    if not row:
        raise HTTPException(status_code=404, detail="Оголошення не знайдено")

    ad, user = row
    return build_ad_response(ad, user)


# ------------------- MY ADS -------------------

@router.get("/my/all", response_model=List[AdResponse])
async def get_my_ads(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(Ad).where(Ad.user_id == current_user.id)
    result = await db.execute(query)
    ads = result.scalars().all()

    return [
        {
            **ad.__dict__,
            "images_urls": ad.images_urls or [],
            "author_name": current_user.name,
            "author_avatar": current_user.avatar,
            "author_phone": current_user.phone
        }
        for ad in ads
    ]


# ------------------- CREATE -------------------

@router.post("/", response_model=AdResponse)
async def create_ad(
    title: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    category: str = Form(...),
    images: List[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    uploaded_urls = []

    if images:
        for img in images:
            if not img.content_type.startswith("image/"):
                continue

            res = cloudinary.uploader.upload(img.file, folder="ads")
            uploaded_urls.append(res.get("secure_url"))

    new_ad = Ad(
        title=title,
        description=description,
        price=price,
        category=category,
        image_url=uploaded_urls[0] if uploaded_urls else None,
        images_urls=uploaded_urls,
        user_id=current_user.id
    )

    db.add(new_ad)
    await db.commit()
    await db.refresh(new_ad)

    return build_ad_response(new_ad, current_user)


# ------------------- UPDATE -------------------

@router.put("/{ad_id}", response_model=AdResponse)
async def update_ad(
    ad_id: int,
    title: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    category: str = Form(...),
    images: List[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ad = await db.get(Ad, ad_id)

    if not ad:
        raise HTTPException(status_code=404, detail="Не знайдено")

    if ad.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Немає доступу")

    if images:
        uploaded_urls = []
        for img in images:
            if img.content_type.startswith("image/"):
                res = cloudinary.uploader.upload(img.file, folder="ads")
                uploaded_urls.append(res.get("secure_url"))

        if uploaded_urls:
            ad.images_urls = uploaded_urls
            ad.image_url = uploaded_urls[0]

    ad.title = title
    ad.description = description
    ad.price = price
    ad.category = category

    await db.commit()
    await db.refresh(ad)

    return build_ad_response(ad, current_user)