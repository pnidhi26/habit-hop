// src/api/auth.js
const API_BASE_URL = 'https://habitstacker-821782230505.us-west1.run.app/api/auth';

async function signup(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Signup API error:', errorData);
      throw errorData; // Throw the error data to be caught in the component
    }

    return await response.json();
  } catch (error) {
    console.error('Signup API error (catch):', error);
    throw error; // Re-throw the error for component-level handling
  }
}

async function login(credentials) {
  try {
    const response = await fetch(`${API_BASE_URL}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Login API error:', errorData);
      throw errorData;
    }

    return await response.json();
  } catch (error) {
    console.error('Login API error (catch):', error);
    throw error;
  }
}

export { signup, login };