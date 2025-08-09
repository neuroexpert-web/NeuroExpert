from fastapi.testclient import TestClient
from backend.main import app
from backend.auth import create_access_token
import pytest

client = TestClient(app)

def test_create_token():
    response = client.post(
        "/token",
        data={"username": "admin", "password": "admin"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

def test_read_users_me():
    access_token = create_access_token(
        data={"sub": "admin"}
    )
    headers = {"Authorization": f"Bearer {access_token}"}
    response = client.get("/users/me", headers=headers)
    assert response.status_code == 200
    assert response.json()["username"] == "admin"

def test_read_users_me_no_token():
    response = client.get("/users/me")
    assert response.status_code == 401

def test_read_users_me_wrong_token():
    headers = {"Authorization": "Bearer wrongtoken"}
    response = client.get("/users/me", headers=headers)
    assert response.status_code == 401
