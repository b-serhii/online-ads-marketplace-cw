import os
import uuid
import shutil
from typing import Optional
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.core.email_sender import send_verify_email
from app.core.jwt import create_access_token
from app.core.security import hash_password, verify_password
from app.db import get_db
from app.models import EmailVerificationToken, User

router = APIRouter(prefix="/auth", tags=["auth"])

class RegisterIn(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)

class LoginIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)

@router.post("/register")
async def register(data: RegisterIn, db: AsyncSession = Depends(get_db)):
    email = data.email.lower().strip()
    existing = await db.scalar(select(User).where(User.email == email))
    if existing:
        raise HTTPException(status_code=400, detail="Email вже використовується")

    user = User(
        name=data.name.strip(),
        email=email,
        password_hash=hash_password(data.password),
        is_email_verified=False,
    )
    db.add(user)
    await db.flush()

    token_row = EmailVerificationToken(
        user_id=user.id,
        expires_at=datetime.now(timezone.utc) + timedelta(hours=24),
    )
    db.add(token_row)

    await db.commit()
    send_verify_email(user.email, str(token_row.token))

    return {"ok": True, "message": "Перевір пошту для підтвердження email"}

@router.get("/verify-email")
async def verify_email(token: str, db: AsyncSession = Depends(get_db)):
    row = await db.scalar(select(EmailVerificationToken).where(EmailVerificationToken.token == token))
    if not row:
        raise HTTPException(status_code=400, detail="Невірний токен")

    if row.used_at is not None:
        raise HTTPException(status_code=400, detail="Токен вже використано")

    if row.expires_at <= datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Токен прострочено")

    await db.execute(update(User).where(User.id == row.user_id).values(is_email_verified=True))
    row.used_at = datetime.now(timezone.utc)
    await db.commit()

    return {"ok": True, "message": "Email підтверджено. Можеш увійти."}

@router.post("/login")
async def login(data: LoginIn, db: AsyncSession = Depends(get_db)):
    email = data.email.lower().strip()
    user = await db.scalar(select(User).where(User.email == email))
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Невірний email або пароль")

    if not user.is_email_verified:
        raise HTTPException(status_code=403, detail="Підтвердіть email перед входом")

    access_token = create_access_token(user.id)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
async def me(user: User = Depends(get_current_user)):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "phone": getattr(user, 'phone', None),
        "avatar": getattr(user, 'avatar', None),
        "is_email_verified": user.is_email_verified,
        "created_at": user.created_at,
        "is_admin": user.is_admin,
    }

@router.post("/me")
async def update_profile(
        name: str = Form(...),
        phone: str = Form(""),
        file: Optional[UploadFile] = File(None),
        db: AsyncSession = Depends(get_db),
        user: User = Depends(get_current_user)
):
    update_data = {
        "name": name.strip(),
        "phone": phone.strip() if phone.strip() else None
    }

    if file:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Файл має бути зображенням")

        UPLOAD_DIR = "uploads/avatars"
        if not os.path.exists(UPLOAD_DIR):
            os.makedirs(UPLOAD_DIR)

        file_extension = file.filename.split(".")[-1]
        new_filename = f"{uuid.uuid4()}.{file_extension}"
        full_path = os.path.join(UPLOAD_DIR, new_filename)

        with open(full_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        update_data["avatar"] = f"/uploads/avatars/{new_filename}"

    await db.execute(
        update(User)
        .where(User.id == user.id)
        .values(**update_data)
    )
    await db.commit()

    result = await db.execute(select(User).where(User.id == user.id))
    fresh_user = result.scalar_one()

    return {
        "id": fresh_user.id,
        "name": fresh_user.name,
        "email": fresh_user.email,
        "phone": fresh_user.phone,
        "avatar": fresh_user.avatar,
        "is_email_verified": fresh_user.is_email_verified,
        "created_at": fresh_user.created_at,
        "is_admin": fresh_user.is_admin,
    }