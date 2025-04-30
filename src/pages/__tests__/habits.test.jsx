// src/api/__tests__/habits.test.js
import '@testing-library/jest-dom';
import { createHabit } from '../../api/habits';

// ─── global fetch mock ────────────────────────────────────────────────────────
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  }),
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('api - createHabit()', () => {
  it('POSTs payload to the correct endpoint and returns parsed JSON', async () => {
    const payload = { habitName: 'Test Habit', minTime: 5 };

    const res = await createHabit(payload);

    expect(fetch).toHaveBeenCalledWith(
      '/api/auth/habit',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }),
    );
    expect(res).toEqual({ success: true });
  });

  it('throws if the response is not OK', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: false, status: 500 }),
    );

    await expect(createHabit({})).rejects.toThrow('status 500');
  });
});
