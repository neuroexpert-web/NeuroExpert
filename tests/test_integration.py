"""
Integration tests for NeuroExpert Platform
Tests the interaction between different components
"""
import pytest
import asyncio
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from main import app
from database import get_db, Base
from models import User, Audit
from auth import get_password_hash, create_access_token


# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture(scope="module")
def setup_database():
    """Setup test database"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def test_user():
    """Create a test user"""
    db = TestingSessionLocal()
    user = User(
        username="testuser",
        email="test@example.com",
        full_name="Test User",
        hashed_password=get_password_hash("testpass123!"),
        disabled=False
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    yield user
    db.delete(user)
    db.commit()
    db.close()


@pytest.fixture
def auth_headers(test_user):
    """Create authentication headers"""
    token = create_access_token(data={"sub": test_user.username})
    return {"Authorization": f"Bearer {token}"}


class TestAuthenticationFlow:
    """Test complete authentication flow"""
    
    def test_user_registration_and_login(self, setup_database):
        """Test user registration and subsequent login"""
        # Register new user
        registration_data = {
            "username": "newuser",
            "password": "NewPass123!",
            "email": "newuser@example.com",
            "full_name": "New User"
        }
        
        response = client.post("/auth/register", json=registration_data)
        assert response.status_code == 200
        user_data = response.json()
        assert user_data["username"] == "newuser"
        assert user_data["email"] == "newuser@example.com"
        
        # Login with new user
        login_data = {
            "username": "newuser",
            "password": "NewPass123!"
        }
        
        response = client.post("/auth/token", data=login_data)
        assert response.status_code == 200
        token_data = response.json()
        assert "access_token" in token_data
        assert "refresh_token" in token_data
        assert token_data["token_type"] == "bearer"
        
        # Use token to access protected endpoint
        headers = {"Authorization": f"Bearer {token_data['access_token']}"}
        response = client.get("/auth/me", headers=headers)
        assert response.status_code == 200
        user_info = response.json()
        assert user_info["username"] == "newuser"
    
    def test_invalid_login_attempts(self, setup_database, test_user):
        """Test rate limiting on invalid login attempts"""
        login_data = {
            "username": test_user.username,
            "password": "wrongpassword"
        }
        
        # Make multiple failed attempts
        for i in range(6):  # Exceed rate limit
            response = client.post("/auth/token", data=login_data)
            if i < 5:
                assert response.status_code == 401
            else:
                # Should be rate limited after 5 attempts
                assert response.status_code == 429
                assert "Too many login attempts" in response.json()["detail"]
    
    def test_duplicate_user_registration(self, setup_database, test_user):
        """Test that duplicate usernames are rejected"""
        registration_data = {
            "username": test_user.username,
            "password": "AnotherPass123!",
            "email": "another@example.com"
        }
        
        response = client.post("/auth/register", json=registration_data)
        assert response.status_code == 400
        assert "already registered" in response.json()["detail"]


class TestCalculationFlow:
    """Test calculation endpoints with validation"""
    
    def test_basic_calculation(self, setup_database):
        """Test basic calculation endpoint"""
        calculation_data = {
            "optionA": True,
            "optionB": False,
            "budget": 5000
        }
        
        response = client.post("/calculate", json=calculation_data)
        assert response.status_code == 200
        
        result = response.json()
        assert "cost" in result
        assert "roi" in result
        assert "monthly_savings" in result
        assert "payback_period_months" in result
        assert result["options_selected"]["optionA"] is True
        assert result["options_selected"]["optionB"] is False
    
    def test_calculation_with_invalid_budget(self, setup_database):
        """Test calculation with invalid budget"""
        calculation_data = {
            "optionA": True,
            "budget": -1000  # Invalid negative budget
        }
        
        response = client.post("/calculate", json=calculation_data)
        assert response.status_code == 422  # Validation error
    
    def test_calculation_edge_cases(self, setup_database):
        """Test calculation edge cases"""
        # Zero budget
        response = client.post("/calculate", json={"budget": 0})
        assert response.status_code == 200
        
        # Maximum budget
        response = client.post("/calculate", json={"budget": 1000000})
        assert response.status_code == 200
        
        # No options selected
        response = client.post("/calculate", json={"optionA": False, "optionB": False})
        assert response.status_code == 200


class TestHealthAndMonitoring:
    """Test health check and monitoring endpoints"""
    
    def test_basic_health_check(self, setup_database):
        """Test basic health check"""
        response = client.get("/api/health")
        assert response.status_code == 200
        
        health_data = response.json()
        assert "status" in health_data
        assert "timestamp" in health_data
        assert "version" in health_data
    
    def test_detailed_health_check(self, setup_database):
        """Test detailed health check"""
        response = client.get("/api/health?detailed=true")
        assert response.status_code == 200
        
        health_data = response.json()
        assert "checks" in health_data
        assert "system" in health_data
        assert "duration" in health_data
    
    def test_specific_service_health_check(self, setup_database):
        """Test specific service health check"""
        response = client.get("/api/health?service=database")
        assert response.status_code == 200
        
        health_data = response.json()
        assert "service" in health_data
        assert health_data["service"] == "database"
    
    def test_health_check_head_request(self, setup_database):
        """Test liveness probe endpoint"""
        response = client.head("/api/health")
        assert response.status_code == 200


class TestErrorHandling:
    """Test error handling across the application"""
    
    def test_404_handling(self, setup_database):
        """Test 404 error handling"""
        response = client.get("/nonexistent-endpoint")
        assert response.status_code == 404
    
    def test_method_not_allowed(self, setup_database):
        """Test method not allowed errors"""
        response = client.delete("/auth/register")  # DELETE not allowed
        assert response.status_code == 405
    
    def test_invalid_json(self, setup_database):
        """Test invalid JSON handling"""
        response = client.post(
            "/auth/register",
            data="invalid json",
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 422
    
    def test_missing_required_fields(self, setup_database):
        """Test missing required fields"""
        response = client.post("/auth/register", json={})
        assert response.status_code == 422
        
        errors = response.json()
        assert "detail" in errors


class TestConcurrency:
    """Test concurrent operations"""
    
    @pytest.mark.asyncio
    async def test_concurrent_registrations(self, setup_database):
        """Test concurrent user registrations"""
        async def register_user(username):
            data = {
                "username": username,
                "password": "TestPass123!",
                "email": f"{username}@example.com"
            }
            response = client.post("/auth/register", json=data)
            return response.status_code == 200
        
        # Attempt to register multiple users concurrently
        tasks = [register_user(f"user{i}") for i in range(10)]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # All registrations should succeed
        successful = sum(1 for result in results if result is True)
        assert successful == 10
    
    @pytest.mark.asyncio
    async def test_concurrent_calculations(self, setup_database):
        """Test concurrent calculations"""
        async def perform_calculation(budget):
            data = {"budget": budget, "optionA": True}
            response = client.post("/calculate", json=data)
            return response.status_code == 200
        
        # Perform multiple calculations concurrently
        tasks = [perform_calculation(1000 + i * 100) for i in range(20)]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # All calculations should succeed
        successful = sum(1 for result in results if result is True)
        assert successful == 20


class TestDataConsistency:
    """Test data consistency and integrity"""
    
    def test_user_data_consistency(self, setup_database, test_user, auth_headers):
        """Test user data consistency across endpoints"""
        # Get user info through auth endpoint
        response = client.get("/auth/me", headers=auth_headers)
        assert response.status_code == 200
        user_info = response.json()
        
        # Verify data consistency
        assert user_info["username"] == test_user.username
        assert user_info["email"] == test_user.email
        assert user_info["full_name"] == test_user.full_name
        assert user_info["disabled"] == test_user.disabled
    
    def test_calculation_consistency(self, setup_database):
        """Test calculation result consistency"""
        data = {"optionA": True, "optionB": True, "budget": 1000}
        
        # Perform same calculation multiple times
        results = []
        for _ in range(5):
            response = client.post("/calculate", json=data)
            assert response.status_code == 200
            results.append(response.json())
        
        # All results should be identical
        first_result = results[0]
        for result in results[1:]:
            assert result["cost"] == first_result["cost"]
            assert result["roi"] == first_result["roi"]
            assert result["monthly_savings"] == first_result["monthly_savings"]


if __name__ == "__main__":
    pytest.main([__file__, "-v"])