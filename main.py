import os
from datetime import timedelta
from fastapi import FastAPI, Request, WebSocket, Query, Depends, HTTPException, status
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

@app.post("/calculate", summary="Calculate cost and ROI", tags=["Calculations"])
async def calculate(request: CalculationRequest):
    '''
    Вычисляет стоимость и ROI на основе выбранных опций с валидацией.
    '''
    try:
        base_cost = request.budget if request.budget else 1000
        
        if request.optionA:
            base_cost += 200
        if request.optionB:
            base_cost += 500
        
        # Расчет ROI
        initial_investment = request.budget if request.budget else 1000
        roi = ((base_cost - initial_investment) / initial_investment) * 100 if initial_investment > 0 else 0
        
        # Дополнительные метрики
        monthly_savings = base_cost * 0.15  # 15% экономии в месяц
        payback_period = initial_investment / monthly_savings if monthly_savings > 0 else 0
        
        return {
            "cost": round(base_cost, 2),
            "roi": round(roi, 2),
            "monthly_savings": round(monthly_savings, 2),
            "payback_period_months": round(payback_period, 1),
            "options_selected": {
                "optionA": request.optionA,
                "optionB": request.optionB
            }
        }
    except Exception as e:
        logging.error(f"Calculation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid calculation parameters"
        )

active_connections = []

# Authentication endpoints
from auth import (
    authenticate_user, create_user, create_access_token, create_refresh_token,
    get_current_user, get_current_active_user, check_rate_limit, reset_rate_limit,
    Token, User, ACCESS_TOKEN_EXPIRE_MINUTES
)
from fastapi.security import OAuth2PasswordRequestForm
from validation import UserRegistrationRequest, CalculationRequest

@app.post("/auth/token", response_model=Token, summary="Login and get access token", tags=["Authentication"])
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Аутентификация пользователя и получение токена доступа
    """
    # Rate limiting
    check_rate_limit(form_data.username)
    
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Сброс счетчика попыток при успешном входе
    reset_rate_limit(form_data.username)
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(data={"sub": user.username})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@app.post("/auth/register", response_model=User, summary="Register new user", tags=["Authentication"])
async def register_user(request: UserRegistrationRequest):
    """
    Регистрация нового пользователя с валидацией
    """
    try:
        user = await create_user(
            username=request.username,
            password=request.password,
            email=request.email,
            full_name=request.full_name
        )
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@app.get("/auth/me", response_model=User, summary="Get current user info", tags=["Authentication"])
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    """
    Получить информацию о текущем пользователе
    """
    return current_user

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

