import os
from fastapi import FastAPI, Request, WebSocket, Query, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
import logging
import sentry_sdk
from sentry_sdk.integrations.asgi import SentryAsgiMiddleware
from jose import jwt, JWTError

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

# OAuth2 for simple auth endpoints (used in tests)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

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

# --- Minimal utility endpoints expected by tests ---

@app.get("/")
async def root():
    return {"message": "Welcome to AI-Audit API"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Issue an access token for provided username (test environment helper)."""
    try:
        import auth as auth_module
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Auth module error: {str(e)}")

    access_token = auth_module.create_access_token({"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me")
async def read_users_me(token: str = Depends(oauth2_scheme)):
    """Decode JWT and return basic user info (test environment helper)."""
    try:
        import auth as auth_module
        secret = auth_module.SECRET_KEY
        algorithm = auth_module.ALGORITHM
        payload = jwt.decode(token, secret, algorithms=[algorithm])
        username: str = payload.get("sub")
        if not username:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return {"username": username}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Token verification failed: {str(e)}")

