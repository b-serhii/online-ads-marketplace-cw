from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from sqlalchemy import func

from app.db import get_db
from app.models import User, Ad
from app.core.deps import get_current_user

router = APIRouter(prefix="/admin", tags=["admin"])

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    is_email_verified: bool
    is_admin: bool

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    is_email_verified: Optional[bool] = None
    is_admin: Optional[bool] = None

class AdAdminOut(BaseModel):
    id: int
    title: str
    price: float
    category: str
    user_id: int
    created_at: datetime
    image_url: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True

async def require_admin(user: User = Depends(get_current_user)) -> User:
    if not getattr(user, "is_admin", False):
        raise HTTPException(status_code=403, detail="Доступ заборонено: потрібні права адміністратора")
    return user


@router.get("/stats")
async def get_admin_stats(db: AsyncSession = Depends(get_db)):
    users_count = await db.execute(select(func.count(User.id)))
    ads_count = await db.execute(select(func.count(Ad.id)))
    admins_count = await db.execute(select(func.count(User.id)).where(User.is_admin == True))

    return {
        "users": users_count.scalar() or 0,
        "active": ads_count.scalar() or 0,
        "admins": admins_count.scalar() or 0
    }

@router.get("/users", response_model=List[UserOut])
async def list_users(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    query = select(User).order_by(User.id.desc())
    result = await db.execute(query)
    return result.scalars().all()

@router.put("/users/{user_id}", response_model=UserOut)
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    query = select(User).where(User.id == user_id)
    result = await db.execute(query)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="Користувача не знайдено")

    update_data = user_data.model_dump(exclude_unset=True) # Оновлено для Pydantic v2
    for key, value in update_data.items():
        setattr(user, key, value)

    await db.commit()
    await db.refresh(user)
    return user

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    query = select(User).where(User.id == user_id)
    result = await db.execute(query)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="Користувача не знайдено")

    await db.delete(user)
    await db.commit()
    return {"detail": "Користувача видалено"}


@router.get("/ads", response_model=List[AdAdminOut])
async def list_all_ads(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):

    query = select(Ad).order_by(Ad.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()

@router.delete("/ads/{ad_id}")
async def admin_delete_ad(
    ad_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    query = select(Ad).where(Ad.id == ad_id)
    result = await db.execute(query)
    ad = result.scalar_one_or_none()

    if not ad:
        raise HTTPException(status_code=404, detail="Оголошення не знайдено")

    await db.delete(ad)
    await db.commit()
    return {"detail": "Оголошення видалено адміністратором"}