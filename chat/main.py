import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException
from fastapi.responses import JSONResponse
from typing import Dict, List, Optional
import json
import datetime

# --- Database Setup (SQLAlchemy) ---
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base, relationship, selectinload
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func, or_
from pydantic import BaseModel, ConfigDict
from sqlalchemy import select
import asyncio

from database import Base, get_db, engine, SessionLocal



class MessageBase(BaseModel):
    content: str


class MessageCreate(MessageBase):
    pass


class MessageRead(BaseModel):
    id: int
    sender_username: str
    recipient_username: str
    content: str
    timestamp: datetime.datetime

    model_config = ConfigDict(from_attributes=True)


class MessageORM(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    sender_username = Column(String, index=True, nullable=False)
    recipient_username = Column(String, index=True, nullable=False)
    content = Column(String, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

async def create_db_and_tables():
    """Create database tables on startup."""
    async with engine.begin() as conn:
        # This will now only create the 'messages' table
        await conn.run_sync(Base.metadata.create_all)


async def create_message(
    db: AsyncSession, sender_username: str, recipient_username: str, content: str
) -> MessageORM:
    """Save a new message to the database."""
    new_message = MessageORM(
        sender_username=sender_username,
        recipient_username=recipient_username,
        content=content
    )
    db.add(new_message)
    await db.commit()
    await db.refresh(new_message)
    return new_message

async def get_message_history(
    db: AsyncSession, user_a_username: str, user_b_username: str
) -> List[MessageORM]:
    """Get all messages exchanged between two users."""
    result = await db.execute(
        select(MessageORM)
        .where(
            or_(
                (MessageORM.sender_username == user_a_username) & (MessageORM.recipient_username == user_b_username),
                (MessageORM.sender_username == user_b_username) & (MessageORM.recipient_username == user_a_username)
            )
        )
        .order_by(MessageORM.timestamp.asc())
    )
    return result.scalars().all()


# --- 4. WebSocket Connection Manager ---
class ConnectionManager:
    """Manages active WebSocket connections mapped by username."""
    def __init__(self):
        # Maps username (str) to their active WebSocket
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, username: str):
        """Accept a new connection and store it."""
        await websocket.accept()
        self.active_connections[username] = websocket

    def disconnect(self, username: str):
        """Remove a WebSocket connection from the dictionary."""
        if username in self.active_connections:
            del self.active_connections[username]

    async def send_personal_message(self, message: str, username: str) -> bool:
        """
        Send a private message to a specific user.
        Returns True if successful, False if user not found.
        """
        websocket = self.active_connections.get(username)
        if websocket:
            await websocket.send_text(message)
            return True
        return False

    async def broadcast(self, message: str):
        """Send a message to all active connections."""
        for connection in self.active_connections.values():
            await connection.send_text(message)
            
    def get_online_users(self) -> List[str]:
        """Return a list of currently connected usernames."""
        return list(self.active_connections.keys())

# --- 5. FastAPI App and Endpoints ---

app = FastAPI()
manager = ConnectionManager()

@app.on_event("startup")
async def on_startup():
    """Create database tables when the application starts."""
    await create_db_and_tables()

# --- HTTP Endpoints ---

@app.get("/users/online", response_model=List[str])
async def get_online_users():
    """
    Retrieve all users who are currently connected via WebSocket.
    This is now the source of truth for "online" status.
    """
    return manager.get_online_users()

@app.get("/messages/{user_a_username}/{user_b_username}", response_model=List[MessageRead])
async def read_message_history(
    user_a_username: str, 
    user_b_username: str, 
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieve the chat history between two users.
    Usernames are provided directly.
    """
    # We no longer check if users exist, we just query for messages
    # between these two username strings.
    messages = await get_message_history(db, user_a_username, user_b_username)
    return messages

# --- WebSocket Endpoint ---

@app.websocket("/ws/{username}")
async def websocket_endpoint(websocket: WebSocket, username: str):
    """
    The main WebSocket endpoint for chat.
    - {username} is the unique username provided by the frontend
      (assumed to be authenticated by Supabase).
    """
    
    # Check for duplicate connections
    if username in manager.active_connections:
        await websocket.close(
            code=1008, 
            reason=f"Username '{username}' is already connected."
        )
        return

    # Connect user to manager
    await manager.connect(websocket, username)
    
    # Announce the new user to everyone
    await manager.broadcast(
        json.dumps({"type": "status", "username": username, "status": "online"})
    )

    try:
        # Main message loop
        while True:
            data_str = await websocket.receive_text()
            
            try:
                # Expecting JSON: {"to_username": "bob", "content": "Hello!"}
                data = json.loads(data_str)
                
                if "to_username" not in data or "content" not in data:
                    await websocket.send_text(
                        json.dumps({"error": "Invalid message format."})
                    )
                    continue

                to_username = data["to_username"]
                content = data["content"]

                # We no longer check if the recipient exists in our DB.
                # We just save the message.
                
                # We need a DB session within the websocket loop
                async with SessionLocal() as db:
                    db_message = await create_message(
                        db, 
                        sender_username=username, 
                        recipient_username=to_username, 
                        content=content
                    )
                
                # Format the message for sending via WebSocket
                message_to_send = {
                    "type": "message",
                    "from_username": username,
                    "content": db_message.content,
                    "timestamp": db_message.timestamp.isoformat()
                }

                # Send to recipient if they are online
                sent = await manager.send_personal_message(
                    json.dumps(message_to_send), to_username
                )
                
                # Send confirmation back to sender
                await websocket.send_text(
                    json.dumps({
                        "type": "confirmation", 
                        "to_username": to_username,
                        "content": content,
                        "delivered": sent
                    })
                )

            except json.JSONDecodeError:
                await websocket.send_text(
                    json.dumps({"error": "Invalid JSON format."})
                )
            
    except WebSocketDisconnect:
        print(f"Client {username} disconnected.")
    except Exception as e:
        print(f"An error occurred for client {username}: {e}")
    finally:
        # Handle disconnection: remove from manager and broadcast offline status
        manager.disconnect(username)
        
        await manager.broadcast(
            json.dumps({"type": "status", "username": username, "status": "offline"})
        )


