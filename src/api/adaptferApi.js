const API_BASE_URL = "http://127.0.0.1:8000";

async function handleResponse(response) {
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      // Response was not JSON.
    }

    throw new Error(message);
  }

  return response.json();
}

export async function getHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);
  return handleResponse(response);
}

export async function getModelStatus() {
  const response = await fetch(`${API_BASE_URL}/models/status`);
  return handleResponse(response);
}

export async function getResults() {
  const response = await fetch(`${API_BASE_URL}/results`);
  return handleResponse(response);
}

export async function getComparison() {
  const response = await fetch(`${API_BASE_URL}/comparison`);
  return handleResponse(response);
}

async function predict(endpoint, imageBlob) {
  const formData = new FormData();

  formData.append(
    "image",
    imageBlob,
    "adaptfer-frame.jpg"
  );

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method: "POST",
      body: formData,
    }
  );

  return handleResponse(response);
}

export async function predictGeneric(imageBlob) {
  return predict("/predict/generic", imageBlob);
}

export async function predictPersonalized(imageBlob) {
  return predict("/predict/personalized", imageBlob);
}
