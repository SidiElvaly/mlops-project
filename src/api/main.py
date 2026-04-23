import os
import logging
from contextlib import asynccontextmanager

import mlflow
import mlflow.sklearn
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles

from src.api.schemas import Transaction, PredictionResponse, HealthResponse

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Config from environment variables
# ---------------------------------------------------------------------------
MLFLOW_TRACKING_URI: str = os.getenv("MLFLOW_TRACKING_URI", "http://13.36.24.137:5000")
MODEL_NAME: str = os.getenv("MODEL_NAME", "fraud-detection-model")
MODEL_STAGE: str = os.getenv("MODEL_STAGE", "Production")

# ---------------------------------------------------------------------------
# Global model state
# ---------------------------------------------------------------------------
model_state: dict = {
    "model": None,
    "model_version": "unknown",
}


# ---------------------------------------------------------------------------
# Lifespan – load model at startup
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the Production model from MLflow Registry at startup."""
    logger.info("Starting up — connecting to MLflow at %s", MLFLOW_TRACKING_URI)
    mlflow.set_tracking_uri(MLFLOW_TRACKING_URI)

    model_uri = f"models:/{MODEL_NAME}/{MODEL_STAGE}"
    try:
        logger.info("Loading model from %s …", model_uri)
        loaded = mlflow.sklearn.load_model(model_uri)

        # Retrieve the actual version number from the registry
        client = mlflow.tracking.MlflowClient()
        versions = client.get_latest_versions(MODEL_NAME, stages=[MODEL_STAGE])
        version_str = versions[0].version if versions else "unknown"

        model_state["model"] = loaded
        model_state["model_version"] = version_str
        logger.info("Model loaded successfully (version %s).", version_str)
    except Exception as exc:
        logger.error("Failed to load model: %s", exc)
        # App still starts; /predict will return 503

    yield  # ← application is running

    logger.info("Shutting down.")
    model_state["model"] = None


# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Credit Card Fraud Detection API",
    description=(
        "Serves an XGBoost fraud-detection model trained on the ULB Credit Card dataset. "
        "The model is loaded from the MLflow Model Registry (Production stage) at startup."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# Mount the frontend static files AFTER app is defined
app.mount("/ui", StaticFiles(directory="frontend", html=True), name="frontend")


# ---------------------------------------------------------------------------
# GET /  —  health check
# ---------------------------------------------------------------------------
@app.get("/", response_model=HealthResponse, tags=["Health"])
def health_check():
    """
    Returns the current status of the API and the loaded model.
    """
    if model_state["model"] is None:
        return HealthResponse(
            status="degraded — model not loaded",
            model_name=MODEL_NAME,
            model_version="N/A",
        )
    return HealthResponse(
        status="ok",
        model_name=MODEL_NAME,
        model_version=model_state["model_version"],
    )


# ---------------------------------------------------------------------------
# POST /predict  —  fraud prediction
# ---------------------------------------------------------------------------
@app.post("/predict", response_model=PredictionResponse, tags=["Prediction"])
def predict(transaction: Transaction):
    """
    Accepts a single credit card transaction and returns a fraud prediction.

    - **is_fraud**: `true` if the model predicts fraud.
    - **probability**: fraud probability between 0 and 1.
    - **model_version**: the MLflow model version that produced this result.
    """
    if model_state["model"] is None:
        raise HTTPException(
            status_code=503,
            detail="Model is not loaded. Please try again later.",
        )

    try:
        # Build a single-row DataFrame in the exact feature order the model expects
        feature_order = (
            ["Time"]
            + [f"V{i}" for i in range(1, 29)]
            + ["Amount"]
        )
        data = pd.DataFrame([transaction.model_dump()])[feature_order]

        proba = model_state["model"].predict_proba(data)
        probability = float(proba[0][1])
        is_fraud = probability >= 0.5

        return PredictionResponse(
            is_fraud=is_fraud,
            probability=round(probability, 6),
            model_version=model_state["model_version"],
        )

    except Exception as exc:
        logger.exception("Prediction error: %s", exc)
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}") from exc
