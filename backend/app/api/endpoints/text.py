from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db, TextProcess
from app.models.text import (
    TextSummaryRequest,
    BulletPointsRequest,
    TextProcessResponse,
    TextProcessHistory
)
from app.services.hf_service import hf_service
from app.auth.auth_bearer import JWTBearer

router = APIRouter()

@router.post("/generate_summary", response_model=TextProcessResponse)
async def generate_summary(
    request: TextSummaryRequest,
    db: Session = Depends(get_db),
    token_data: dict = Depends(JWTBearer())
):
    """
    Generate a summary of the provided text using the Hugging Face API
    """
    user_id = token_data.get("user_id")
    
    # Generate summary using the Hugging Face service
    summary_text = await hf_service.generate_summary(request.text)
    
    # Save the result in the database
    text_process = TextProcess(
        user_id=user_id,
        input_text=request.text,
        output_text=summary_text,
        process_type="summary"
    )
    
    db.add(text_process)
    db.commit()
    db.refresh(text_process)
    
    return text_process

@router.post("/generate_bullet_points", response_model=TextProcessResponse)
async def generate_bullet_points(
    request: BulletPointsRequest,
    db: Session = Depends(get_db),
    token_data: dict = Depends(JWTBearer())
):
    """
    Generate bullet points from the provided text using the Hugging Face API
    """
    user_id = token_data.get("user_id")
    
    # Generate bullet points using the Hugging Face service
    bullet_points = await hf_service.generate_bullet_points(request.text)
    
    # Save the result in the database
    text_process = TextProcess(
        user_id=user_id,
        input_text=request.text,
        output_text=bullet_points,
        process_type="bullet_points"
    )
    
    db.add(text_process)
    db.commit()
    db.refresh(text_process)
    
    return text_process

@router.get("/history", response_model=TextProcessHistory)
async def get_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    process_type: str = Query(None),
    db: Session = Depends(get_db),
    token_data: dict = Depends(JWTBearer())
):
    """
    Retrieve the user's text processing history
    """
    user_id = token_data.get("user_id")
    
    # Build the query
    query = db.query(TextProcess).filter(TextProcess.user_id == user_id)
    
    # Filter by process type if specified
    if process_type:
        query = query.filter(TextProcess.process_type == process_type)
    
    # Get total count
    total = query.count()
    
    # Get items with pagination
    items = query.order_by(TextProcess.created_at.desc()).offset(skip).limit(limit).all()
    
    return TextProcessHistory(items=items, total=total)