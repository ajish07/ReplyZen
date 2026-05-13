from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime, timedelta
import secrets

from core.database import get_db
from core.security import get_password_hash, verify_password, create_access_token
from core.config import settings
from models.models import User
from schemas.schemas import UserCreate, UserLogin, Token, ForgotPassword, ResetPassword
from utils.email import send_verification_email, send_reset_password_email

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.email == user_in.email))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user_in.password)
    verification_token = secrets.token_urlsafe(32)
    
    new_user = User(
        name=user_in.name,
        email=user_in.email,
        hashed_password=hashed_password,
        verification_token=verification_token
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    try:
        await send_verification_email(new_user.email, verification_token)
    except Exception as e:
        print(f"Failed to send email: {e}")
        # In a real app we might handle this differently, but we proceed here
    
    return {"message": "User created successfully. Please check your email to verify."}


@router.get("/verify-email/{token}")
async def verify_email(token: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.verification_token == token))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired verification token")
    
    user.is_verified = True
    user.verification_token = None
    await db.commit()
    return {"message": "Email verified successfully"}


@router.post("/login", response_model=Token)
async def login(user_in: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.email == user_in.email))
    user = result.scalars().first()

    # Check if admin is trying to login
    is_admin_login = False
    if user_in.email == settings.ADMIN_EMAIL:
        if user_in.password == settings.ADMIN_PASSWORD:
            is_admin_login = True
            if not user:
                # Create admin user if not exists
                user = User(
                    name="Admin",
                    email=settings.ADMIN_EMAIL,
                    hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
                    is_verified=True,
                    role="admin"
                )
                db.add(user)
                await db.commit()
                await db.refresh(user)
        else:
            raise HTTPException(status_code=401, detail="Invalid admin credentials")
            
    if not is_admin_login:
        if not user or not verify_password(user_in.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Incorrect email or password")
        
        if not user.is_verified:
            raise HTTPException(status_code=403, detail="Email not verified")

    # Update last login
    user.last_login = datetime.utcnow()
    await db.commit()

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/forgot-password")
async def forgot_password(req: ForgotPassword, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.email == req.email))
    user = result.scalars().first()
    
    if user:
        reset_token = secrets.token_urlsafe(32)
        user.reset_token = reset_token
        await db.commit()
        try:
            await send_reset_password_email(user.email, reset_token)
        except Exception as e:
             print(f"Failed to send email: {e}")
             
    return {"message": "If that email is registered, you will receive a password reset link."}


@router.post("/reset-password/{token}")
async def reset_password(token: str, req: ResetPassword, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.reset_token == token))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
        
    user.hashed_password = get_password_hash(req.password)
    user.reset_token = None
    await db.commit()
    return {"message": "Password updated successfully"}
