const API_BASE_URL = 'http://localhost:8080';

// Helper function to get the auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Server returned ${response.status}`);
  }
  return await response.json();
};

// Get all plans for a user
export const getPlans = async (userId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await fetch(
      `${API_BASE_URL}/api/getPlans/${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching plans:', error);
    throw error;
  }
};

// Get a specific plan
export const getPlan = async (userId, planId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await fetch(
      `${API_BASE_URL}/api/getPlan/${userId}/${planId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching plan:', error);
    throw error;
  }
};

// Create a new plan
export const createPlan = async (userId, planName) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await fetch(
      `${API_BASE_URL}/api/createPlan/${userId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ planName }),
        credentials: 'include'
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error('Error creating plan:', error);
    throw error;
  }
};

// Update a plan
export const updatePlan = async (userId, planId, planName) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await fetch(
      `${API_BASE_URL}/api/updatePlan/${userId}/${planId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ planName }),
        credentials: 'include'
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error('Error updating plan:', error);
    throw error;
  }
};

// Delete a plan
export const deletePlan = async (userId, planId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await fetch(
      `${API_BASE_URL}/api/removePlan/${userId}/${planId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error('Error deleting plan:', error);
    throw error;
  }
};