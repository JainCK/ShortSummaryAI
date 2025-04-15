import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db
from app.models.user import UserCreate
from app.auth.auth_handler import create_user

# Create in-memory SQLite database for testing
TEST_SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    TEST_SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db():
    """Create a fresh database for each test."""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db):
    """Create a test client using the test database."""
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    
    app.dependency_overrides = {}


@pytest.fixture(scope="function")
def test_user(db):
    """Create a test user and return user data."""
    user_data = UserCreate(
        email="test@example.com",
        username="testuser",
        password="TestPassword123"
    )
    user = create_user(db, user_data)
    return {"user": user, "password": "TestPassword123"}


@pytest.fixture(scope="function")
def test_user_token(client, test_user):
    """Get an authentication token for the test user."""
    response = client.post(
        "/api/v1/auth/login",
        json={"email": test_user["user"].email, "password": test_user["password"]}
    )
    token_data = response.json()
    return token_data["access_token"]