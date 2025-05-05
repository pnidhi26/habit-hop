const API_BASE_URL = 'http://localhost:8080/api/user';

export async function getUserInfo() {
    const token = localStorage.getItem('authToken');
  
    const response = await fetch(`${API_BASE_URL}/info`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch user info');
    }
  
    return await response.json();
  }