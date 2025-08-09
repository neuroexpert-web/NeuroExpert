import os
from fastapi import FastAPI, Request, WebSocket, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging
import sentry_sdk
from sentry_sdk.integrations.asgi import SentryAsgiMiddleware

# Настройка Sentry и CORS
SENTRY_DSN = os.getenv('SENTRY_DSN', '')
if SENTRY_DSN:
    sentry_sdk.init(SENTRY_DSN, traces_sample_rate=1.0)

app = FastAPI(
    title="NeuroExpert API",
    description="API для калькулятора и витрины NeuroExpert",
    version="1.0.0"
)

if SENTRY_DSN:
    app.add_middleware(SentryAsgiMiddleware)

logging.basicConfig(level=logging.INFO)

origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logging.info(f"Incoming request: {request.method} {request.url}")
    response = await call_next(request)
    logging.info(f"Response status: {response.status_code}")
    return response

class CalculationParams(BaseModel):
    optionA: bool = False
    optionB: bool = False

@app.get("/calculate", summary="Calculate cost and ROI", tags=["Calculations"])
async def calculate(optionA: bool = Query(False), optionB: bool = Query(False)):
    '''
    Вычисляет стоимость и ROI на основе выбранных опций.
    - optionA: первая опция (bool)
    - optionB: вторая опция (bool)
    Возвращает JSON с ключами cost и roi.
    '''
    base_cost = 1000
    if optionA:
        base_cost += 200
    if optionB:
        base_cost += 500
    roi = ((base_cost - 1000) / 1000) * 100
    return {"cost": base_cost, "roi": roi}

active_connections = []

@app.websocket("/ws/logs")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            for connection in active_connections:
                await connection.send_text(f"Log message: {data}")
    except Exception:
        if websocket in active_connections:
            active_connections.remove(websocket)

