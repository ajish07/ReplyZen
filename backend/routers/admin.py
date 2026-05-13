from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from typing import List
from datetime import datetime, date

from core.database import get_db
from core.deps import get_current_admin_user
from models.models import User, ChatMessage
from schemas.schemas import UserOut

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/stats")
async def get_stats(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    total_users_result = await db.execute(select(func.count(User.id)).filter(User.role == "user"))
    total_users = total_users_result.scalar() or 0
    
    verified_users_result = await db.execute(select(func.count(User.id)).filter(User.is_verified == True, User.role == "user"))
    verified_users = verified_users_result.scalar() or 0
    
    # Calculate active users today
    today = date.today()
    active_users_result = await db.execute(
        select(func.count(User.id)).filter(
            User.role == "user",
            func.date(User.last_login) == today
        )
    )
    active_users = active_users_result.scalar() or 0
    
    return {
        "total_users": total_users,
        "verified_users": verified_users,
        "active_users": active_users
    }

@router.get("/users", response_model=List[UserOut])
async def get_users(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    query = (
        select(User, func.count(ChatMessage.id).label("total_messages_sent"))
        .outerjoin(ChatMessage, User.id == ChatMessage.user_id)
        .filter(User.role == "user")
        .group_by(User.id)
        .order_by(User.created_at.desc())
    )
    result = await db.execute(query)
    users = []
    for user, count in result.all():
        user_dict = {c.name: getattr(user, c.name) for c in user.__table__.columns}
        user_dict["total_messages_sent"] = count
        users.append(user_dict)
    return users

@router.get("/users/{user_id}", response_model=UserOut)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    result = await db.execute(select(User).filter(User.id == user_id, User.role == "user"))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/users/{user_id}/history")
async def get_user_history(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    # Verify user exists
    user_result = await db.execute(select(User).filter(User.id == user_id))
    user = user_result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    result = await db.execute(
        select(ChatMessage)
        .filter(ChatMessage.user_id == user_id)
        .order_by(ChatMessage.timestamp.asc())
    )
    messages = result.scalars().all()
    return messages

@router.get("/active-users", response_model=List[UserOut])
async def get_active_users(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    today = date.today()
    result = await db.execute(
        select(User).filter(
            User.role == "user",
            func.date(User.last_login) == today
        )
    )
    users = result.scalars().all()
    return users
