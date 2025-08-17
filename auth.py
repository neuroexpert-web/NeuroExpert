from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from functools import lru_cache
from time import time
import logging

load_dotenv()

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Настройки безопасности
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY environment variable is not set. Please set it in your .env file")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

# Rate limiting settings
RATE_LIMIT_WINDOW = int(os.getenv("RATE_LIMIT_WINDOW_MS", "60000")) / 1000  # Convert to seconds
RATE_LIMIT_MAX_ATTEMPTS = int(os.getenv("RATE_LIMIT_MAX_REQUESTS", "5"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class Token(BaseModel):
    access_token: str
    token_type: str
    refresh_token: Optional[str] = None

class TokenData(BaseModel):
    username: Optional[str] = None
    expires: Optional[datetime] = None

class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = None

class UserInDB(User):
    hashed_password: str

# Rate limiting storage
login_attempts = {}

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode = data.copy()
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    
    # В production здесь должен быть запрос к базе данных
    user = await get_user_from_db(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# Database integration (заглушка - должна быть заменена на реальную БД)
async def get_user_from_db(username: str) -> Optional[UserInDB]:
    """
    Получить пользователя из базы данных
    В production это должно быть подключение к реальной БД
    """
    # TODO: Implement database query
    # Example:
    # async with database.session() as session:
    #     result = await session.execute(
    #         select(UserModel).where(UserModel.username == username)
    #     )
    #     user = result.scalar_one_or_none()
    #     if user:
    #         return UserInDB(**user.dict())
    logger.warning(f"get_user_from_db called for username: {username} - Database integration pending")
    return None

async def authenticate_user(username: str, password: str) -> Optional[UserInDB]:
    """Аутентификация пользователя"""
    user = await get_user_from_db(username)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

async def create_user(username: str, password: str, email: str = None, full_name: str = None):
    """Создание нового пользователя в базе данных"""
    # TODO: Implement database insertion
    # Example:
    # async with database.session() as session:
    #     existing = await session.execute(
    #         select(UserModel).where(UserModel.username == username)
    #     )
    #     if existing.scalar_one_or_none():
    #         raise HTTPException(
    #             status_code=status.HTTP_400_BAD_REQUEST,
    #             detail="Username already registered"
    #         )
    #     
    #     hashed_password = get_password_hash(password)
    #     user = UserModel(
    #         username=username,
    #         email=email,
    #         full_name=full_name,
    #         hashed_password=hashed_password,
    #         disabled=False
    #     )
    #     session.add(user)
    #     await session.commit()
    #     return User(**user.dict())
    
    raise NotImplementedError("Database integration pending")

def check_rate_limit(identifier: str) -> None:
    """
    Проверка rate limiting для защиты от брутфорса
    identifier может быть username или IP адресом
    """
    current_time = time()
    
    # Очищаем старые записи
    expired_keys = [
        key for key, attempts in login_attempts.items()
        if current_time - attempts["first_attempt"] > RATE_LIMIT_WINDOW
    ]
    for key in expired_keys:
        del login_attempts[key]
    
    # Проверяем текущие попытки
    if identifier in login_attempts:
        attempts = login_attempts[identifier]
        if attempts["count"] >= RATE_LIMIT_MAX_ATTEMPTS:
            time_left = RATE_LIMIT_WINDOW - (current_time - attempts["first_attempt"])
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Too many login attempts. Please try again in {int(time_left)} seconds.",
                headers={"Retry-After": str(int(time_left))}
            )
        attempts["count"] += 1
    else:
        login_attempts[identifier] = {
            "count": 1,
            "first_attempt": current_time
        }

def reset_rate_limit(identifier: str) -> None:
    """Сброс счетчика попыток после успешного входа"""
    if identifier in login_attempts:
        del login_attempts[identifier]
