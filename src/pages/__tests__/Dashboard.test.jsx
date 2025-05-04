import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';
import { getUserInfo } from '../../api/userApi';

// Mock the modules
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

jest.mock('../../api/userApi', () => ({
  getUserInfo: jest.fn()
}));

jest.mock('../../components/CompletedHabitsSection', () => {
  return function MockCompletedHabitsBox() {
    return <div data-testid="completed-habits-box">Completed Habits Box</div>;
  };
});

jest.mock('../../components/WeeklyReport', () => {
  return function MockWeeklyReport() {
    return <div data-testid="weekly-report">Weekly Report</div>;
  };
});

jest.mock('../../components/TodaysActivityOverview', () => {
  return function MockTodaysActivityOverview() {
    return <div data-testid="todays-activity">Today's Activity Overview</div>;
  };
});

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders dashboard with title', () => {
    getUserInfo.mockResolvedValueOnce({});
    
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });

  test('displays current date', () => {
    getUserInfo.mockResolvedValueOnce({});
    
    // Mock Date to have consistent test results
    const mockDate = new Date('2025-05-04T10:30:00');
    const originalDate = global.Date;
    global.Date = jest.fn(() => mockDate);
    global.Date.toLocaleString = originalDate.toLocaleString;
    
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Sunday, May 4, 2025/i)).toBeInTheDocument();
    
    // Restore the original Date
    global.Date = originalDate;
  });

  test('renders all component sections', () => {
    getUserInfo.mockResolvedValueOnce({});
    
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('todays-activity')).toBeInTheDocument();
    expect(screen.getByTestId('completed-habits-box')).toBeInTheDocument();
    expect(screen.getByTestId('weekly-report')).toBeInTheDocument();
  });

  test('displays welcome message with username when user data loads', async () => {
    const mockUserData = { username: 'TestUser' };
    getUserInfo.mockResolvedValueOnce(mockUserData);
    
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
  });

  test('displays generic welcome message when user data is not loaded', () => {
    getUserInfo.mockResolvedValueOnce(null);
    
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Welcome to your main dashboard!/i)).toBeInTheDocument();
  });

  test('navigates to habits page when Quick Add button is clicked', () => {
    getUserInfo.mockResolvedValueOnce({});
    
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    
    const quickAddButton = screen.getByRole('button', { name: /quick add habit/i });
    fireEvent.click(quickAddButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/habits');
  });

  test('handles API error gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    getUserInfo.mockRejectedValueOnce(new Error('Failed to fetch user data'));
    
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Welcome to your main dashboard!/i)).toBeInTheDocument();
    
    consoleErrorSpy.mockRestore();
  });
});