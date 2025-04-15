import pytest
from fastapi import status
from unittest.mock import patch, AsyncMock

@pytest.fixture
def auth_headers(test_user_token):
    return {"Authorization": f"Bearer {test_user_token}"}

# Mock the Hugging Face service for testing
@pytest.fixture(autouse=True)
def mock_hf_service():
    with patch("app.services.hf_service.HuggingFaceService._make_inference_request") as mock:
        # Set up mock response
        mock_response = AsyncMock()
        mock_response.return_value = [{"summary_text": "This is a mocked summary."}]
        mock.return_value = mock_response.return_value
        yield mock

def test_generate_summary_unauthorized(client):
    response = client.post(
        "/api/v1/text/generate_summary",
        json={"text": "This is a test text for summarization."}
    )
    
    assert response.status_code == status.HTTP_403_FORBIDDEN

def test_generate_summary_success(client, auth_headers):
    test_text = "This is a test text for summarization. It should be long enough to be summarized effectively. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    
    response = client.post(
        "/api/v1/text/generate_summary",
        json={"text": test_text},
        headers=auth_headers
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["input_text"] == test_text
    assert data["output_text"] == "This is a mocked summary."
    assert data["process_type"] == "summary"
    assert "id" in data
    assert "created_at" in data

def test_generate_bullet_points_unauthorized(client):
    response = client.post(
        "/api/v1/text/generate_bullet_points",
        json={"text": "This is a test text for bullet points."}
    )
    
    assert response.status_code == status.HTTP_403_FORBIDDEN

def test_generate_bullet_points_success(client, auth_headers):
    test_text = "This is a test text for bullet points. It should be long enough to generate meaningful bullet points. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    
    # Override the mock for bullet points specifically
    with patch("app.services.hf_service.hf_service.generate_bullet_points") as mock:
        mock.return_value = "• Point 1\n• Point 2\n• Point 3"
        
        response = client.post(
            "/api/v1/text/generate_bullet_points",
            json={"text": test_text},
            headers=auth_headers
        )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["input_text"] == test_text
    assert data["output_text"] == "• Point 1\n• Point 2\n• Point 3"
    assert data["process_type"] == "bullet_points"
    assert "id" in data
    assert "created_at" in data

def test_get_history_unauthorized(client):
    response = client.get("/api/v1/text/history")
    
    assert response.status_code == status.HTTP_403_FORBIDDEN

def test_get_history_empty(client, auth_headers):
    response = client.get("/api/v1/text/history", headers=auth_headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["total"] == 0
    assert len(data["items"]) == 0

def test_get_history_with_items(client, auth_headers):
    # First create some history items
    test_text = "This is a test text."
    
    client.post(
        "/api/v1/text/generate_summary",
        json={"text": test_text},
        headers=auth_headers
    )
    
    client.post(
        "/api/v1/text/generate_bullet_points",
        json={"text": test_text},
        headers=auth_headers
    )
    
    # Now test the history endpoint
    response = client.get("/api/v1/text/history", headers=auth_headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["total"] == 2
    assert len(data["items"]) == 2
    
    # One should be a summary and one should be bullet points
    process_types = [item["process_type"] for item in data["items"]]
    assert "summary" in process_types
    assert "bullet_points" in process_types

def test_get_history_with_filter(client, auth_headers):
    # First create some history items
    test_text = "This is a test text."
    
    client.post(
        "/api/v1/text/generate_summary",
        json={"text": test_text},
        headers=auth_headers
    )
    
    client.post(
        "/api/v1/text/generate_bullet_points",
        json={"text": test_text},
        headers=auth_headers
    )
    
    # Now test the history endpoint with filter
    response = client.get(
        "/api/v1/text/history?process_type=summary",
        headers=auth_headers
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["total"] == 1
    assert len(data["items"]) == 1
    assert data["items"][0]["process_type"] == "summary"

def test_get_history_with_pagination(client, auth_headers):
    # First create multiple history items
    test_text = "This is a test text."
    
    for _ in range(5):
        client.post(
            "/api/v1/text/generate_summary",
            json={"text": test_text},
            headers=auth_headers
        )
    
    # Test pagination - page 1 (limit 2)
    response = client.get(
        "/api/v1/text/history?skip=0&limit=2",
        headers=auth_headers
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["total"] == 5  # Total count should be 5
    assert len(data["items"]) == 2  # But only 2 items returned
    
    # Test pagination - page 2 (limit 2)
    response = client.get(
        "/api/v1/text/history?skip=2&limit=2",
        headers=auth_headers
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["total"] == 5
    assert len(data["items"]) == 2