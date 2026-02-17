import os
import shutil
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.db import get_db
from app.models import User
from app.core.deps import get_current_user

router = APIRouter(prefix="/users", tags=["users"])


class UserProfile(BaseModel):
    id: int
    name: str
    email: str
    avatar: Optional[str] = None
    is_admin: bool
    is_email_verified: bool

    class Config:
        from_attributes = True


@router.get("/me", response_model=UserProfile)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserProfile)
async def update_user_me(
        name: str = Form(...),
        file: Optional[UploadFile] = File(None),
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    current_user.name = name

    if file:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Файл має бути зображенням")

        UPLOAD_DIR = "uploads"
        if not os.path.exists(UPLOAD_DIR):
            os.makedirs(UPLOAD_DIR)

        file_extension = file.filename.split(".")[-1]
        new_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, new_filename)

        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            # Видалення старого фото
            if current_user.avatar and current_user.avatar.startswith("/static/"):
                old_file_name = current_user.avatar.replace("/static/", "")
                old_file_path = os.path.join(UPLOAD_DIR, old_file_name)
                if os.path.exists(old_file_path):
                    os.remove(old_file_path)

            current_user.avatar = f"/static/{new_filename}"  # ВИПРАВЛЕНО ТУТ
        except Exception:
            raise HTTPException(status_code=500, detail="Помилка при збереженні файлу")

    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)

    return current_user