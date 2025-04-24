// src/api/habits.js
// Tiny wrapper so UI code never imports axios/fetch directly
export async function createHabit(payload) {
    const res = await fetch('/api/auth/habit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    return res.json();              // { success: true } expected
  }
  