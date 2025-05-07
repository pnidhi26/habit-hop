// src/pages/__tests__/Habit.test.jsx

import '@testing-library/jest-dom';
import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Habits from '../Habits';

// always “log in” as user 123
jest.mock('jwt-decode', () => {
  const decode = () => ({ userId: '123' });
  return { __esModule: true, default: decode, jwtDecode: decode };
});

const initialHabits = {
  success: true,
  habits: [
    {
      habitId: '1',
      habitName: 'Yoga',
      habitDescription: 'Morning stretch',
      habitImage: 'https://example.com/yoga.jpg',
    },
  ],
};

describe('<Habits />', () => {
  beforeEach(() => {
    localStorage.setItem('authToken', 'fake.jwt.token');

    // 1) initial load
    // 2) delete call
    // 3) refetch yields empty list
    jest.spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(initialHabits),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, habits: [] }),
      });

    // silence JS alerts & confirm
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.spyOn(window, 'confirm').mockReturnValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
  });

  test('renders the habit returned from the API', async () => {
    render(
      <MemoryRouter>
        <Habits />
      </MemoryRouter>
    );

    // wait for the image to appear
    const yogaImg = await screen.findByAltText(/yoga/i);
    expect(yogaImg).toBeInTheDocument();
  });

  test('deletes the habit after confirmation', async () => {
    render(
      <MemoryRouter>
        <Habits />
      </MemoryRouter>
    );

    // first, wait for it to render
    const yogaImg = await screen.findByAltText(/yoga/i);

    // enter delete mode
    fireEvent.click(screen.getByRole('button', { name: /delete habit/i }));
    // click the per-card Delete button
    fireEvent.click(screen.getByRole('button', { name: /^delete$/i }));

    // now it should vanish
    await waitForElementToBeRemoved(yogaImg);
    expect(screen.queryByAltText(/yoga/i)).not.toBeInTheDocument();
  });
});
