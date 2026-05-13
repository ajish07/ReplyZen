from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime
import asyncio
import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

from core.database import get_db
from core.deps import get_current_active_user
from models.models import User, ChatMessage
from schemas.schemas import ChatMessageCreate

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("")
async def chat(
    message_in: ChatMessageCreate, 
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        # Fetch previous conversation history for the current user (last 10 messages)
        result = await db.execute(
            select(ChatMessage)
            .where(ChatMessage.user_id == current_user.id)
            .order_by(ChatMessage.timestamp.asc())
        )
        past_messages = result.scalars().all()
        
        contents = []
        # Reconstruct the conversation context
        for msg in past_messages[-10:]:
            contents.append(types.Content(role="user", parts=[types.Part.from_text(text=msg.user_message)]))
            contents.append(types.Content(role="model", parts=[types.Part.from_text(text=msg.bot_response)]))
        
        # Add the current user message
        contents.append(types.Content(role="user", parts=[types.Part.from_text(text=message_in.message)]))
        
        def _generate():
            return client.models.generate_content(
                model='gemini-2.5-flash',
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction="You are a helpful, intelligent, and perfectly capable AI assistant.",
                )
            )

        response = await asyncio.to_thread(_generate)
        bot_response = response.text
    except Exception as e:
        print(f"Gemini API Error: {e}")
        bot_response = f"I'm sorry, I encountered an error while processing your request. Please try again."
    
    # Save message to DB
    new_message = ChatMessage(
        user_id=current_user.id,
        user_message=message_in.message,
        bot_response=bot_response
    )
    
    # Update user's last_active
    current_user.last_active = datetime.utcnow()
    
    db.add(new_message)
    await db.commit()
    await db.refresh(new_message)
    
    return {
        "user_message": message_in.message,
        "bot_response": bot_response,
        "timestamp": new_message.timestamp
    }
