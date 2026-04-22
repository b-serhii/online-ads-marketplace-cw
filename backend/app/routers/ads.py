import cloudinary.uploader
from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
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
    images_urls: List[str] = []
    user_id: int
    created_at: datetime
    updated_at: datetime
    author_name: Optional[str] = None
    author_avatar: Optional[str] = None
    author_phone: Optional[str] = None

    class Config:
        from_attributes = True

def build_ad_response(ad: Ad, user: User):
    return {
        "id": ad.id,
        "title": ad.title,
        "description": ad.description,
        "price": ad.price,
        "category": ad.category,
        "image_url": ad.image_url,
        "images_urls": ad.images_urls if ad.images_urls else [],
        "user_id": ad.user_id,
        "created_at": ad.created_at,
        "updated_at": ad.updated_at, # І тут
        "author_name": user.name if user else "Анонім",
        "author_avatar": user.avatar if user else None,
        "author_phone": user.phone if user else None
    }

# ------------------- РОУТИ -------------------

# 1. Всі активні оголошення (для Маркетплейсу)
@router.get("/", response_model=List[AdResponse])
async def get_all_ads(db: AsyncSession = Depends(get_db)):
    # Завантажуємо оголошення разом з авторами
    query = select(Ad, User).join(User, Ad.user_id == User.id).where(Ad.is_active == True).order_by(
        Ad.created_at.desc())
    result = await db.execute(query)
    rows = result.all()
    return [build_ad_response(row[0], row[1]) for row in rows]


# 2. Окреме оголошення по ID
@router.get("/{ad_id}", response_model=AdResponse)
async def get_ad(ad_id: int, db: AsyncSession = Depends(get_db)):
    query = select(Ad, User).join(User, Ad.user_id == User.id).where(Ad.id == ad_id)
    result = await db.execute(query)
    row = result.first()

    if not row:
        raise HTTPException(status_code=404, detail="Оголошення не знайдено")

    return build_ad_response(row[0], row[1])


# 3. Мої оголошення
@router.get("/my/all", response_model=List[AdResponse])
async def get_my_ads(
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    query = select(Ad).where(Ad.user_id == current_user.id).order_by(Ad.created_at.desc())
    result = await db.execute(query)
    ads = result.scalars().all()
    return [build_ad_response(ad, current_user) for ad in ads]


# 4. Створення
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


# 5. Редагування
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

@router.delete("/{ad_id}")
async def delete_ad(
        ad_id: int,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Ad).where(Ad.id == ad_id))
    ad = result.scalar_one_or_none()

    if not ad:
        raise HTTPException(status_code=404, detail="Оголошення вже видалено або не існує")

    if ad.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Ви не можете видалити чуже оголошення")

    await db.delete(ad)
    await db.commit()

    return {"ok": True, "message": "Оголошення видалено"}