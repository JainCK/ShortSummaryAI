from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class TextProcessBase(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)
    
class TextSummaryRequest(TextProcessBase):
    pass

class BulletPointsRequest(TextProcessBase):
    pass

class TextProcessResponse(BaseModel):
    id: int
    input_text: str
    output_text: str
    process_type: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class TextProcessHistory(BaseModel):
    items: List[TextProcessResponse]
    total: int
    
    class Config:
        orm_mode = True