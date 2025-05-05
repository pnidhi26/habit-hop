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

// Add a new activity to a plan
export const addActivity = async (userId, planId, habitId, date, time, timeOfDay, repeat = false) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await fetch(
      `${API_BASE_URL}/api/addActivity/${userId}/${planId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          habitId,
          date,
          time,
          timeOfDay,
          repeat
        }),
        credentials: 'include'
      }
    );

    console.log("Sending repeat parameter:", repeat);



    return await handleResponse(response);
  } catch (error) {
    console.error('Error adding activity:', error);
    throw error;
  }
};

// Update an existing activity
export const updateActivity = async (userId, planId, habitId, dateIndex, updates) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await fetch(
      `${API_BASE_URL}/api/updateActivity/${userId}/${planId}/${habitId}/${dateIndex}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates),
        credentials: 'include'
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error('Error updating activity:', error);
    throw error;
  }
};

// Delete an activity
export const deleteActivity = async (userId, planId, habitId, dateIndex) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await fetch(
      `${API_BASE_URL}/api/deleteActivity/${userId}/${planId}/${habitId}/${dateIndex}`,
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
    console.error('Error deleting activity:', error);
    throw error;
  }
};

// Toggle activity status
export const toggleActivityStatus = async (userId, planId, habitId, dateIndex) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await fetch(
      `${API_BASE_URL}/api/toggleActivityStatus/${userId}/${planId}/${habitId}/${dateIndex}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error('Error toggling activity status:', error);
    throw error;
  }
};