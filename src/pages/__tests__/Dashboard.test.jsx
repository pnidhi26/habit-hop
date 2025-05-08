/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

/* ------------------------------------------------------------------ *
 *  MOCKS
 * ------------------------------------------------------------------ */
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const real = jest.requireActual('react-router-dom');
  return { __esModule: true, ...real, useNavigate: () => mockNavigate };
});

jest.mock('jwt-decode', () => ({
  __esModule: true,
  jwtDecode: () => ({ userId: 'U‑123', username: 'Bob' }),
}));

jest.mock('../../components/TodaysActivityOverview', () => () => (
  <div data-testid="todays-activity">Today's Activity Overview</div>
));

jest.mock('../../components/WeeklyReport', () => () => (
  <div data-testid="weekly-report">Weekly Report</div>
));


global.fetch = jest.fn(() =>
  Promise.resolve({ json: () => Promise.resolve({ success: true, plans: [] }) }),
);

Object.defineProperty(window, 'localStorage', {
  writable: true,
  value: {
    getItem: () => 'fake-token',
    setItem: () => {},
    clear: () => {},
  },
});

/* ------------------------------------------------------------------ *
 *  HELPERS
 * ------------------------------------------------------------------ */
const freezeTime = (iso) => {
  const RealDate = Date;
  global.Date = class extends RealDate {
    constructor(...a) {
      return a.length ? new RealDate(...a) : new RealDate(iso);
    }
    static now() {
      return new RealDate(iso).getTime();
    }
  };
  return () => (global.Date = RealDate);
};

/* ------------------------------------------------------------------ *
 *  TESTS
 * ------------------------------------------------------------------ */
describe('Dashboard page', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders heading', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });

  it('prints today’s date (fixed)', () => {
    const restore = freezeTime('2025-05-04T10:30:00');
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Sunday.*4.*May.*2025.*10:30/i)).toBeInTheDocument();
    restore();
  });

  it('renders all main sections', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );
    expect(await screen.findByTestId('todays-activity')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: /today's completed habits/i }))
      .toBeInTheDocument();
    expect(await screen.findByTestId('weekly-report')).toBeInTheDocument();
  });

  it('greets user by name', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );
    expect(
      await screen.findByText(/welcome to your main dashboard,\s*Bob!/i),
    ).toBeInTheDocument();
  });

  it('shows generic greeting when no token', async () => {
    window.localStorage.getItem = () => null; // simulate logged‑out
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );
    expect(
      await screen.findByText(/welcome to your main dashboard!/i),
    ).toBeInTheDocument();
  });

  it('navigates to /habits on “Quick Add”', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );
    fireEvent.click(await screen.findByRole('button', { name: /quick add habit/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/habits');
  });

  it('handles API failure gracefully', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({ json: () => Promise.resolve({ success: false }) }),
    );
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );
    expect(
      await screen.findByText(/welcome to your main dashboard!/i),
    ).toBeInTheDocument();
  });
});
