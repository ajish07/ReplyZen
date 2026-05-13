from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from core.config import settings
from pydantic import EmailStr

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

fm = FastMail(conf)

async def send_verification_email(email: EmailStr, token: str):
    link = f"{settings.FRONTEND_URL}/verify-email/{token}"
    html = f"""
    <p>Hi,</p>
    <p>Please click on the link below to verify your email:</p>
    <p><a href="{link}">{link}</a></p>
    """
    message = MessageSchema(
        subject="Verify your email",
        recipients=[email],
        body=html,
        subtype=MessageType.html
    )
    print("\n" + "="*50)
    print(f"DEVELOPMENT MODE: Verification Email for {email}")
    print(f"VERIFICATION LINK: {link}")
    print("="*50 + "\n")
    try:
        await fm.send_message(message)
    except Exception as e:
        print(f"Email delivery skipped (Configure .env to send real emails): {e}")

async def send_reset_password_email(email: EmailStr, token: str):
    link = f"{settings.FRONTEND_URL}/reset-password/{token}"
    html = f"""
    <p>Hi,</p>
    <p>Please click on the link below to reset your password:</p>
    <p><a href="{link}">{link}</a></p>
    """
    message = MessageSchema(
        subject="Reset your password",
        recipients=[email],
        body=html,
        subtype=MessageType.html
    )
    print("\n" + "="*50)
    print(f"DEVELOPMENT MODE: Reset Password Email for {email}")
    print(f"RESET PASSWORD LINK: {link}")
    print("="*50 + "\n")
    try:
        await fm.send_message(message)
    except Exception as e:
        print(f"Email delivery skipped (Configure .env to send real emails): {e}")
