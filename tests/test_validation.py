"""
Tests for validation schemas and utilities
"""
import pytest
from pydantic import ValidationError
from validation import (
    UserRegistrationRequest,
    UserLoginRequest,
    CalculationRequest,
    ContactFormRequest,
    AIPromptRequest,
    AuditRequest,
    sanitize_html,
    validate_api_key
)


class TestUserRegistrationRequest:
    """Tests for user registration validation"""
    
    def test_valid_registration(self):
        """Test valid user registration data"""
        data = {
            "username": "testuser",
            "password": "TestPass123!",
            "email": "test@example.com",
            "full_name": "Test User"
        }
        request = UserRegistrationRequest(**data)
        assert request.username == "testuser"
        assert request.password == "TestPass123!"
        assert request.email == "test@example.com"
        assert request.full_name == "Test User"
    
    def test_username_validation(self):
        """Test username validation rules"""
        # Valid usernames
        valid_usernames = ["user123", "test_user", "user-name", "TestUser"]
        for username in valid_usernames:
            data = {"username": username, "password": "TestPass123!"}
            request = UserRegistrationRequest(**data)
            assert request.username == username.lower()
        
        # Invalid usernames
        invalid_usernames = ["user@name", "user name", "user#123", ""]
        for username in invalid_usernames:
            with pytest.raises(ValidationError):
                UserRegistrationRequest(username=username, password="TestPass123!")
    
    def test_password_validation(self):
        """Test password validation rules"""
        # Valid passwords
        valid_passwords = ["TestPass123!", "Secure1@", "MyP@ssw0rd"]
        for password in valid_passwords:
            data = {"username": "testuser", "password": password}
            request = UserRegistrationRequest(**data)
            assert request.password == password
        
        # Invalid passwords (missing requirements)
        invalid_passwords = [
            "password",  # No number or special char
            "PASSWORD123",  # No lowercase
            "password123",  # No uppercase
            "Password",  # No number or special char
            "Pass1!",  # Too short
        ]
        for password in invalid_passwords:
            with pytest.raises(ValidationError):
                UserRegistrationRequest(username="testuser", password=password)
    
    def test_email_validation(self):
        """Test email validation"""
        # Valid emails
        valid_emails = ["test@example.com", "user.name@domain.co.uk", None]
        for email in valid_emails:
            data = {"username": "testuser", "password": "TestPass123!", "email": email}
            request = UserRegistrationRequest(**data)
            assert request.email == email
        
        # Invalid emails
        invalid_emails = ["invalid-email", "@domain.com", "user@", ""]
        for email in invalid_emails:
            with pytest.raises(ValidationError):
                UserRegistrationRequest(
                    username="testuser", 
                    password="TestPass123!", 
                    email=email
                )


class TestCalculationRequest:
    """Tests for calculation request validation"""
    
    def test_valid_calculation(self):
        """Test valid calculation request"""
        data = {
            "optionA": True,
            "optionB": False,
            "budget": 5000.0
        }
        request = CalculationRequest(**data)
        assert request.optionA is True
        assert request.optionB is False
        assert request.budget == 5000.0
    
    def test_budget_validation(self):
        """Test budget validation"""
        # Valid budgets
        valid_budgets = [0, 1000, 999999.99, None]
        for budget in valid_budgets:
            data = {"budget": budget}
            request = CalculationRequest(**data)
            assert request.budget == budget
        
        # Invalid budgets
        invalid_budgets = [-100, 1000001]
        for budget in invalid_budgets:
            with pytest.raises(ValidationError):
                CalculationRequest(budget=budget)


class TestAIPromptRequest:
    """Tests for AI prompt validation"""
    
    def test_valid_prompt(self):
        """Test valid AI prompt request"""
        data = {
            "question": "What is the meaning of life?",
            "model": "gemini",
            "temperature": 0.7,
            "max_tokens": 1000
        }
        request = AIPromptRequest(**data)
        assert request.question == "What is the meaning of life?"
        assert request.model == "gemini"
        assert request.temperature == 0.7
        assert request.max_tokens == 1000
    
    def test_model_validation(self):
        """Test model validation"""
        # Valid models
        valid_models = ["gemini", "openai", "claude", "openrouter"]
        for model in valid_models:
            data = {"question": "Test question", "model": model}
            request = AIPromptRequest(**data)
            assert request.model == model
        
        # Invalid model
        with pytest.raises(ValidationError):
            AIPromptRequest(question="Test question", model="invalid-model")
    
    def test_dangerous_content_detection(self):
        """Test dangerous content detection in prompts"""
        dangerous_prompts = [
            "<script>alert('xss')</script>",
            "javascript:alert('xss')",
            "eval('malicious code')",
            "__import__('os').system('rm -rf /')"
        ]
        
        for prompt in dangerous_prompts:
            with pytest.raises(ValidationError):
                AIPromptRequest(question=prompt)
    
    def test_parameter_ranges(self):
        """Test parameter range validation"""
        # Valid ranges
        valid_data = [
            {"temperature": 0.0, "max_tokens": 1},
            {"temperature": 2.0, "max_tokens": 4000},
            {"temperature": 1.0, "max_tokens": 2000}
        ]
        
        for data in valid_data:
            request = AIPromptRequest(question="Test", **data)
            assert request.temperature == data["temperature"]
            assert request.max_tokens == data["max_tokens"]
        
        # Invalid ranges
        invalid_data = [
            {"temperature": -0.1},
            {"temperature": 2.1},
            {"max_tokens": 0},
            {"max_tokens": 4001}
        ]
        
        for data in invalid_data:
            with pytest.raises(ValidationError):
                AIPromptRequest(question="Test", **data)


class TestContactFormRequest:
    """Tests for contact form validation"""
    
    def test_valid_contact_form(self):
        """Test valid contact form data"""
        data = {
            "name": "John Doe",
            "email": "john@example.com",
            "subject": "Business inquiry",
            "message": "I would like to know more about your services.",
            "phone": "+1234567890",
            "company": "Acme Corp"
        }
        request = ContactFormRequest(**data)
        assert request.name == "John Doe"
        assert request.email == "john@example.com"
        assert request.subject == "Business inquiry"
        assert request.message == "I would like to know more about your services."
        assert request.phone == "+1234567890"
        assert request.company == "Acme Corp"
    
    def test_phone_validation(self):
        """Test phone number validation"""
        # Valid phone numbers
        valid_phones = ["+1234567890", "1234567890", "+44123456789", None]
        for phone in valid_phones:
            data = {
                "name": "Test",
                "email": "test@example.com",
                "subject": "Test subject",
                "message": "Test message",
                "phone": phone
            }
            request = ContactFormRequest(**data)
            assert request.phone == phone
        
        # Invalid phone numbers
        invalid_phones = ["123", "abc123", "+", "123-456-7890"]
        for phone in invalid_phones:
            with pytest.raises(ValidationError):
                ContactFormRequest(
                    name="Test",
                    email="test@example.com",
                    subject="Test subject",
                    message="Test message",
                    phone=phone
                )
    
    def test_html_prevention(self):
        """Test HTML tag prevention"""
        html_inputs = [
            "<script>alert('xss')</script>",
            "<b>bold text</b>",
            "Normal text with <em>emphasis</em>"
        ]
        
        for html_input in html_inputs:
            with pytest.raises(ValidationError):
                ContactFormRequest(
                    name=html_input,
                    email="test@example.com",
                    subject="Test subject",
                    message="Test message"
                )


class TestAuditRequest:
    """Tests for audit request validation"""
    
    def test_valid_urls(self):
        """Test valid URL validation"""
        valid_urls = [
            "https://example.com",
            "http://test.co.uk",
            "https://subdomain.example.org/path?query=value"
        ]
        
        for url in valid_urls:
            data = {"url": url}
            request = AuditRequest(**data)
            assert request.url == url
    
    def test_invalid_urls(self):
        """Test invalid URL rejection"""
        invalid_urls = [
            "not-a-url",
            "ftp://example.com",
            "https://localhost/test",
            "http://127.0.0.1/admin",
            "https://192.168.1.1/internal"
        ]
        
        for url in invalid_urls:
            with pytest.raises(ValidationError):
                AuditRequest(url=url)


class TestUtilityFunctions:
    """Tests for utility functions"""
    
    def test_sanitize_html(self):
        """Test HTML sanitization"""
        test_cases = [
            ("<script>alert('xss')</script>", "&lt;script&gt;alert('xss')&lt;/script&gt;"),
            ("<b>Bold text</b>", "&lt;b&gt;Bold text&lt;/b&gt;"),
            ("Normal text", "Normal text"),
            ("Text with & symbols", "Text with &amp; symbols")
        ]
        
        for input_text, expected in test_cases:
            result = sanitize_html(input_text)
            assert expected in result or result == expected
    
    def test_validate_api_key(self):
        """Test API key validation"""
        # Valid API keys (mock format)
        valid_keys = {
            "gemini": "AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "openai": "sk-" + "x" * 48,
            "telegram": "1234567890:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
        }
        
        for service, key in valid_keys.items():
            assert validate_api_key(key, service) is True
        
        # Invalid API keys
        invalid_keys = {
            "gemini": "invalid-key",
            "openai": "sk-short",
            "telegram": "123:short",
            "unknown": "any-key"
        }
        
        for service, key in invalid_keys.items():
            assert validate_api_key(key, service) is False


if __name__ == "__main__":
    pytest.main([__file__])