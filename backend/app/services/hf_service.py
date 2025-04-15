import httpx
import json
from typing import Dict, Any
from fastapi import HTTPException

from app.config import settings

class HuggingFaceService:
    """Service to interact with the Hugging Face Inference API"""
    
    def __init__(self):
        self.token = settings.HF_TOKEN
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
        self.timeout = 30.0
    
    async def _make_inference_request(self, model: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Make a request to the Hugging Face Inference API"""
        url = f"https://api-inference.huggingface.co/models/{model}"
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    url,
                    headers=self.headers,
                    json=payload,
                    timeout=self.timeout
                )
            
            if response.status_code != 200:
                error_detail = response.text
                try:
                    error_json = response.json()
                    if "error" in error_json:
                        error_detail = error_json["error"]
                except:
                    pass
                
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Hugging Face API error: {error_detail}"
                )
            
            return response.json()
        
        except httpx.TimeoutException:
            raise HTTPException(
                status_code=504,
                detail="Request to Hugging Face API timed out"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error communicating with Hugging Face API: {str(e)}"
            )
    
    async def generate_summary(self, text: str) -> str:
        """Generate a summary of the provided text"""
        model = settings.HF_SUMMARY_MODEL
        payload = {
            "inputs": text,
            "parameters": {
                "max_length": 150,
                "min_length": 30,
                "do_sample": False
            }
        }
        
        result = await self._make_inference_request(model, payload)
        
        # Extract summary text from response
        if isinstance(result, list) and len(result) > 0:
            if "summary_text" in result[0]:
                return result[0]["summary_text"]
            elif "generated_text" in result[0]:
                return result[0]["generated_text"]
            else:
                return result[0].get("text", "")
        
        raise HTTPException(
            status_code=500,
            detail="Unexpected response format from Hugging Face API"
        )
    
    async def generate_bullet_points(self, text: str) -> str:
        """Generate bullet points from the provided text"""
        model = settings.HF_BULLET_MODEL
        payload = {
            "inputs": f"Summarize the following text in bullet points: {text}",
            "parameters": {
                "max_length": 250,
                "min_length": 50,
                "do_sample": False
            }
        }
        
        result = await self._make_inference_request(model, payload)
        
        # Extract bullet points text from response
        if isinstance(result, list) and len(result) > 0:
            if "summary_text" in result[0]:
                return result[0]["summary_text"]
            elif "generated_text" in result[0]:
                return result[0]["generated_text"]
            else:
                return result[0].get("text", "")
        
        raise HTTPException(
            status_code=500,
            detail="Unexpected response format from Hugging Face API"
        )

# Singleton instance of the service
hf_service = HuggingFaceService()