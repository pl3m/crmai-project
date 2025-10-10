"""
FastAPI application for AI-powered lead scoring.
Provides REST API endpoints for predicting lead conversion probability.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ConfigDict
import joblib
import numpy as np
from pathlib import Path
from typing import Literal

# Industry score mapping
INDUSTRY_SCORES = {
    'technology': 0.8,
    'finance': 0.7,
    'healthcare': 0.6,
    'manufacturing': 0.5,
    'retail': 0.4,
}

# Load model on startup
model = None
model_path = Path(__file__).parent / 'ml_models' / 'lead_scorer.pkl'


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup/shutdown events."""
    global model
    # Startup: Load the model (non-blocking)
    print("🚀 Starting AI service...")
    try:
        if model_path.exists():
            model = joblib.load(model_path)
            print(f"✅ Model loaded successfully from {model_path}")
        else:
            print(f"⚠️  Warning: Model not found at {model_path}")
            print("   Service will use fallback calculations")
    except Exception as e:
        print(f"⚠️  Warning: Error loading model: {e}")
        print("   Service will use fallback calculations")
    
    print("✅ AI service ready!")
    yield
    
    # Shutdown: Clean up
    print("👋 Shutting down AI service...")


# Initialize FastAPI app
app = FastAPI(
    title="AI Lead Scoring Service",
    description="Machine learning API for predicting lead conversion probability",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models for request/response
class LeadScoreRequest(BaseModel):
    """Request model for lead scoring."""
    company_size: int = Field(..., ge=1, le=100000, description="Number of employees")
    industry: Literal['technology', 'finance', 'healthcare', 'retail', 'manufacturing'] = Field(
        ..., description="Industry sector"
    )
    engagement_score: float = Field(..., ge=0.0, le=1.0, description="Engagement score (0-1)")

    class Config:
        json_schema_extra = {
            "example": {
                "company_size": 500,
                "industry": "technology",
                "engagement_score": 0.75
            }
        }


class LeadScoreResponse(BaseModel):
    """Response model for lead scoring."""
    score: float = Field(..., description="Lead score (0-100)")
    probability: float = Field(..., description="Conversion probability (0-1)")
    priority: Literal['high', 'medium', 'low'] = Field(..., description="Lead priority")

    class Config:
        json_schema_extra = {
            "example": {
                "score": 78.5,
                "probability": 0.785,
                "priority": "high"
            }
        }


class HealthResponse(BaseModel):
    """Response model for health check."""
    model_config = ConfigDict(protected_namespaces=())
    
    status: str
    model_loaded: bool
    version: str


@app.get("/", tags=["General"])
async def root():
    """Root endpoint."""
    return {
        "message": "AI Lead Scoring Service",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "predict": "/predict/lead-score",
            "docs": "/docs"
        }
    }


@app.get("/health", tags=["General"])
async def health_check():
    """Health check endpoint - always returns 200 for Railway."""
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "version": "1.0.0"
    }


@app.post("/predict/lead-score", response_model=LeadScoreResponse, tags=["Prediction"])
async def predict_lead_score(request: LeadScoreRequest):
    """
    Predict lead conversion score based on company size, industry, and engagement.
    
    The model uses a Random Forest Classifier trained on historical lead data.
    Returns a score (0-100), probability (0-1), and priority level.
    """
    try:
        # Map industry to numeric score
        industry_score = INDUSTRY_SCORES.get(request.industry.lower(), 0.5)
        
        # Prepare features for prediction
        # Features: [company_size, engagement_score, industry_score]
        features = np.array([[
            request.company_size,
            request.engagement_score,
            industry_score
        ]])
        
        # Make prediction
        if model is not None:
            # Use trained regressor model
            probability = float(model.predict(features)[0])
        else:
            # Fallback: simple weighted calculation if model not available
            # Normalize company size (log scale)
            company_size_normalized = np.log10(request.company_size) / np.log10(10000)
            
            # Calculate weighted probability
            probability = (
                0.4 * request.engagement_score +
                0.3 * industry_score +
                0.3 * company_size_normalized
            )
            probability = float(np.clip(probability, 0, 1))
        
        # Convert to 0-100 score
        score = probability * 100
        
        # Determine priority
        if score >= 70:
            priority = 'high'
        elif score >= 40:
            priority = 'medium'
        else:
            priority = 'low'
        
        return LeadScoreResponse(
            score=round(score, 2),
            probability=round(probability, 4),
            priority=priority
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error predicting lead score: {str(e)}"
        )


@app.get("/model/info", tags=["Model"])
async def model_info():
    """Get information about the loaded model."""
    if model is None:
        return {
            "loaded": False,
            "message": "No model loaded. Train a model first."
        }
    
    try:
        return {
            "loaded": True,
            "model_type": type(model).__name__,
            "n_estimators": getattr(model, 'n_estimators', None),
            "feature_names": ['company_size', 'engagement_score', 'industry_score'],
            "feature_importances": model.feature_importances_.tolist() if hasattr(model, 'feature_importances_') else None
        }
    except Exception as e:
        return {
            "loaded": True,
            "error": str(e)
        }


if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

