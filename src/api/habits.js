// src/api/habits.js
// Tiny wrapper so UI code never imports axios/fetch directly
export async function createHabit(payload, userId) {
  console.log("Sending payload to backend...");

  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('No token found');
  }

  const res = await fetch(`http://localhost:8080/api/createHabit/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`status ${res.status}`);
  }

  return res.json();  // { success: true } expected
}
