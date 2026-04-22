import os
import smtplib
from email.message import EmailMessage

from app.core.config import settings


def send_verify_email(to_email: str, token: str) -> None:
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

    verify_link = f"{frontend_url}/verify-email?token={token}"

    msg = EmailMessage()
    msg["Subject"] = "Підтвердження реєстрації"
    msg["From"] = settings.GMAIL_USER
    msg["To"] = to_email
    msg.set_content(
        "Привіт!\n\n"
        "Підтвердьте email, перейшовши за посиланням:\n"
        f"{verify_link}\n\n"
        "Якщо ви не реєструвались — просто ігноруйте цей лист."
    )

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(settings.GMAIL_USER, settings.GMAIL_APP_PASSWORD)
        smtp.send_message(msg)