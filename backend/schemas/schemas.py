from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    is_verified: bool
    role: str
    created_at: datetime
    last_login: Optional[datetime]
    last_active: Optional[datetime]
    total_messages_sent: int = 0

    class Config:
        from_attributes = True

class ChatMessageCreate(BaseModel):
    message: str
    session_id: Optional[str] = "default"

class ForgotPassword(BaseModel):
    email: EmailStr

class ResetPassword(BaseModel):
    password: str
