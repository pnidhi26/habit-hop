const API_BASE_URL = 'http://localhost:8080/api/auth';

async function getHabit(habitId) {
    try {
      const response = await fetch(`${API_BASE_URL}/getHabit/${habitId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Get Habit API error:', errorData);
        throw errorData;
      }
  
      return await response.json();
    } catch (error) {
      console.error('Get Habit API error (catch):', error);
      throw error;
    }
}