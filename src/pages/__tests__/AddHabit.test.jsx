// ─── mocks ────────────────────────────────────────────────────────────────
jest.mock('jwt-decode', () => {
  const fake = () => ({ userId: 'mockUserId' });
  return { __esModule: true, default: fake, jwtDecode: fake };
});
// ──────────────────────────────────────────────────────────────────────────

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AddHabit from '../AddHabit';

beforeEach(() => {
  // stub out fetch
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ message: 'created' }),
  });
  localStorage.setItem('authToken', 'dummy');
});

afterEach(() => {
  jest.resetAllMocks();
  localStorage.clear();
});

test('renders form and submits new habit', async () => {
  render(
    <MemoryRouter>
      <AddHabit />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/habit name/i), {
    target: { value: 'Yoga' },
  });

  fireEvent.click(screen.getByRole('button', { name: /create habit/i }));

  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

  const [url, options] = global.fetch.mock.calls[0];
  expect(url).toMatch(/\/createHabit\/mockUserId$/);
  expect(options.method).toBe('POST');
});
