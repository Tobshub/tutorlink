from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel



class MessageCreate(BaseModel):
    conversation_id: int
    content: Optional[str] = None 
    file_url: Optional[str] = None
    file_type: Optional[str] = None

class MessageResponse(BaseModel):
    id: int
    conversation_id: int
    sender_type: str
    sender_id: int
    content: str
    created_at: datetime
    is_read: bool
    
    class Config:
        from_attributes = True

class ConversationCreate(BaseModel):
    creator_email: str
    initial_message: str

class ConversationResponse(BaseModel):
    id: int
    creator_id: int
    business_id: int
    created_at: datetime
    updated_at: datetime
    is_active: bool
    creator_email: str
    business_name: str
    last_message: Optional[str] = None
    last_message_time: Optional[datetime] = None 
    unread_count: int = 0
    
    class Config:
        from_attributes = True

class ConversationDetail(BaseModel):
    id: int
    created_at: datetime
    updated_at: datetime
    is_active: bool
    creator_email: str
    business_name: str
    messages: List[MessageResponse] = []
    
    class Config:
        from_attributes = True



