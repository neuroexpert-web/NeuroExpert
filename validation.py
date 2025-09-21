"""
Validation schemas and utilities for NeuroExpert Platform
"""
from pydantic import BaseModel, EmailStr, validator, Field
from typing import Optional
import re


class UserRegistrationRequest(BaseModel):
    """Схема для регистрации пользователя"""
    username: str = Field(..., min_length=3, max_length=50, description="Username (3-50 characters)")
    password: str = Field(..., min_length=8, max_length=128, description="Password (8-128 characters)")
    email: Optional[EmailStr] = Field(None, description="Valid email address")
    full_name: Optional[str] = Field(None, max_length=100, description="Full name (max 100 characters)")
    
    @validator('username')
    def validate_username(cls, v):
        if not re.match(r'^[a-zA-Z0-9_-]+$', v):
            raise ValueError('Username can only contain letters, numbers, underscores, and hyphens')
        return v.lower()
    
    @validator('password')
    def validate_password(cls, v):
        if not re.search(r'[A-Za-z]', v):
            raise ValueError('Password must contain at least one letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one number')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character')
        return v
    
    @validator('full_name')
    def validate_full_name(cls, v):
        if v and not re.match(r'^[a-zA-Z\s\u0400-\u04FF]+$', v):
            raise ValueError('Full name can only contain letters and spaces')
        return v


class UserLoginRequest(BaseModel):
    """Схема для входа пользователя"""
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8, max_length=128)


class CalculationRequest(BaseModel):
    """Схема для запроса расчета"""
    optionA: bool = Field(default=False, description="Enable option A")
    optionB: bool = Field(default=False, description="Enable option B")
    budget: Optional[float] = Field(None, ge=0, le=1000000, description="Budget in USD (0-1,000,000)")
    
    @validator('budget')
    def validate_budget(cls, v):
        if v is not None and v < 0:
            raise ValueError('Budget must be non-negative')
        return v


class ContactFormRequest(BaseModel):
    """Схема для контактной формы"""
    name: str = Field(..., min_length=2, max_length=100, description="Contact name")
    email: EmailStr = Field(..., description="Valid email address")
    subject: str = Field(..., min_length=5, max_length=200, description="Message subject")
    message: str = Field(..., min_length=10, max_length=2000, description="Message content")
    phone: Optional[str] = Field(None, description="Phone number")
    company: Optional[str] = Field(None, max_length=100, description="Company name")
    
    @validator('phone')
    def validate_phone(cls, v):
        if v and not re.match(r'^\+?[1-9]\d{1,14}$', v):
            raise ValueError('Invalid phone number format')
        return v
    
    @validator('name', 'subject', 'message')
    def validate_no_html(cls, v):
        if '<' in v or '>' in v:
            raise ValueError('HTML tags are not allowed')
        return v.strip()


class AIPromptRequest(BaseModel):
    """Схема для AI запросов"""
    question: str = Field(..., min_length=1, max_length=4000, description="AI prompt")
    model: str = Field(default="gemini", description="AI model to use")
    temperature: Optional[float] = Field(0.7, ge=0.0, le=2.0, description="Model temperature")
    max_tokens: Optional[int] = Field(1000, ge=1, le=4000, description="Maximum response tokens")
    
    @validator('model')
    def validate_model(cls, v):
        allowed_models = ['gemini', 'openai', 'claude', 'openrouter']
        if v not in allowed_models:
            raise ValueError(f'Model must be one of: {", ".join(allowed_models)}')
        return v
    
    @validator('question')
    def validate_question(cls, v):
        # Проверка на потенциально вредоносный контент
        dangerous_patterns = [
            r'<script',
            r'javascript:',
            r'eval\(',
            r'exec\(',
            r'system\(',
            r'__import__'
        ]
        
        for pattern in dangerous_patterns:
            if re.search(pattern, v, re.IGNORECASE):
                raise ValueError('Potentially dangerous content detected')
        
        return v.strip()


class AuditRequest(BaseModel):
    """Схема для запроса аудита"""
    url: str = Field(..., description="URL to audit")
    audit_type: str = Field(default="full", description="Type of audit")
    
    @validator('url')
    def validate_url(cls, v):
        url_pattern = re.compile(
            r'^https?://'  # http:// or https://
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
            r'localhost|'  # localhost...
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
            r'(?::\d+)?'  # optional port
            r'(?:/?|[/?]\S+)$', re.IGNORECASE)
        
        if not url_pattern.match(v):
            raise ValueError('Invalid URL format')
        
        # Блокируем локальные и приватные адреса в production
        blocked_domains = ['localhost', '127.0.0.1', '0.0.0.0', '192.168.', '10.', '172.16.']
        for blocked in blocked_domains:
            if blocked in v.lower():
                raise ValueError('Local and private URLs are not allowed')
        
        return v


class UpdateUserRequest(BaseModel):
    """Схема для обновления профиля пользователя"""
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(None, max_length=100)
    current_password: Optional[str] = Field(None, min_length=8)
    new_password: Optional[str] = Field(None, min_length=8, max_length=128)
    
    @validator('new_password')
    def validate_new_password(cls, v):
        if v:
            if not re.search(r'[A-Za-z]', v):
                raise ValueError('Password must contain at least one letter')
            if not re.search(r'\d', v):
                raise ValueError('Password must contain at least one number')
            if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
                raise ValueError('Password must contain at least one special character')
        return v


# Utility functions for validation
def sanitize_html(text: str) -> str:
    """Remove HTML tags from text"""
    import html
    # Escape HTML entities
    text = html.escape(text)
    # Remove any remaining tags
    text = re.sub(r'<[^>]+>', '', text)
    return text.strip()


def validate_file_upload(filename: str, max_size_mb: int = 10) -> bool:
    """Validate uploaded file"""
    allowed_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx', '.txt'}
    
    # Check extension
    ext = os.path.splitext(filename.lower())[1]
    if ext not in allowed_extensions:
        raise ValueError(f'File type {ext} not allowed')
    
    return True


def validate_api_key(api_key: str, service: str) -> bool:
    """Validate API key format"""
    patterns = {
        'gemini': r'^AIza[0-9A-Za-z-_]{35}$',
        'openai': r'^sk-[a-zA-Z0-9]{48}$',
        'anthropic': r'^sk-ant-[a-zA-Z0-9-_]{95}$',
        'telegram': r'^[0-9]{8,10}:[a-zA-Z0-9_-]{35}$'
    }
    
    pattern = patterns.get(service.lower())
    if not pattern:
        return False
    
    return bool(re.match(pattern, api_key))


class ValidationError(Exception):
    """Custom validation error"""
    def __init__(self, message: str, field: str = None):
        self.message = message
        self.field = field
        super().__init__(self.message)