import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Leaderboard from '../Leaderboard';

// Mock Material UI components that might cause issues in tests
jest.mock('@mui/material', () => {
  const originalModule = jest.requireActual('@mui/material');
  return {
    ...originalModule,
    useMediaQuery: () => false, // Default to desktop view
    useTheme: () => ({
      breakpoints: {
        down: () => false,
      },
    }),
    CircularProgress: () => <div data-testid="loading-spinner" />,
  };
});

// Mock Material UI icons
jest.mock('@mui/icons-material/EmojiEvents', () => () => <div data-testid="emoji-events-icon" />);
jest.mock('@mui/icons-material/WatchLater', () => () => <div data-testid="watch-later-icon" />);
jest.mock('@mui/icons-material/CheckCircle', () => () => <div data-testid="check-circle-icon" />);

describe('Leaderboard Component', () => {
  // Mock the setTimeout function to resolve immediately
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('renders the leaderboard title', () => {
    render(<Leaderboard />);
    expect(screen.getByText('Leaderboard')).toBeInTheDocument();
    expect(screen.getByTestId('emoji-events-icon')).toBeInTheDocument();
    expect(screen.getByText('Complete habits and earn points to climb the rankings')).toBeInTheDocument();
  });

  test('renders the timeframe tabs', () => {
    render(<Leaderboard />);
    expect(screen.getByText('Daily')).toBeInTheDocument();
    expect(screen.getByText('Weekly')).toBeInTheDocument();
    expect(screen.getByText('Monthly')).toBeInTheDocument();
    expect(screen.getByText('All Time')).toBeInTheDocument();
  });

  test('shows loading state initially', () => {
    render(<Leaderboard />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('loads and displays leaderboard data after loading', async () => {
    render(<Leaderboard />);
    
    // Fast-forward timer to trigger the useEffect
    jest.advanceTimersByTime(1000);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Check if the top 3 users are displayed
    expect(screen.getByText('Prakash Nidhi Verma')).toBeInTheDocument();
    expect(screen.getByText('Dentai')).toBeInTheDocument();
    expect(screen.getByText('Boxi')).toBeInTheDocument();
    
    // Check if the remaining users are displayed
    expect(screen.getByText('Austin')).toBeInTheDocument();
    expect(screen.getByText('Aditi')).toBeInTheDocument();
    expect(screen.getByText('James Wilson')).toBeInTheDocument();
    expect(screen.getByText('Alex Parker')).toBeInTheDocument();
    expect(screen.getByText('Olivia Martinez')).toBeInTheDocument();
  });

  test('highlights the current user', async () => {
    render(<Leaderboard />);
    
    // Fast-forward timer to trigger the useEffect
    jest.advanceTimersByTime(1000);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // In the mock data, "Dentai" is set as the current user
    const dentaiElement = screen.getByText('Dentai');
    expect(dentaiElement).toBeInTheDocument();
    
    // Check if the current rank section is displayed
    expect(screen.getByText(/Your Current Rank:/)).toBeInTheDocument();
    expect(screen.getByText(/of 8/)).toBeInTheDocument();
  });

  test('changes timeframe when clicking on tabs', async () => {
    render(<Leaderboard />);
    
    // Fast-forward timer to trigger initial loading
    jest.advanceTimersByTime(1000);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Click on Monthly tab
    fireEvent.click(screen.getByText('Monthly'));
    
    // Check if loading spinner appears again
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    
    // Fast-forward timer again
    jest.advanceTimersByTime(1000);
    
    // Wait for loading to complete after changing timeframe
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Verify data is displayed again
    expect(screen.getByText('Prakash Nidhi Verma')).toBeInTheDocument();
  });

  test('displays points and stats for users', async () => {
    render(<Leaderboard />);
    
    // Fast-forward timer to trigger the useEffect
    jest.advanceTimersByTime(1000);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Check for points display
    expect(screen.getByText('1250 points')).toBeInTheDocument();
    expect(screen.getByText('980 points')).toBeInTheDocument();
    expect(screen.getByText('890 points')).toBeInTheDocument();
    
    // Check for habits completion display
    expect(screen.getByText('38 habits')).toBeInTheDocument();
    expect(screen.getByText('31 habits')).toBeInTheDocument();
    expect(screen.getByText('26 habits')).toBeInTheDocument();
    
    // Check for streak display
    expect(screen.getByText('14 day streak')).toBeInTheDocument();
    expect(screen.getByText('8 day streak')).toBeInTheDocument();
    expect(screen.getByText('6 day streak')).toBeInTheDocument();
  });

  test('displays user ranks correctly', async () => {
    render(<Leaderboard />);
    
    // Fast-forward timer to trigger the useEffect
    jest.advanceTimersByTime(1000);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Check for the "Rankings" section header
    expect(screen.getByText('Rankings')).toBeInTheDocument();
    
    // Check for rank numbers (ranks 4-8 should be visible in the Rankings section)
    const rankNumbers = ["4", "5", "6", "7", "8"];
    rankNumbers.forEach(number => {
      // This might be tricky as the number could appear in other contexts
      // We're looking for it as a standalone element
      const elements = screen.getAllByText(number);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  test('displays "Your Current Rank" section correctly', async () => {
    render(<Leaderboard />);
    
    // Fast-forward timer to trigger the useEffect
    jest.advanceTimersByTime(1000);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Check if the current rank section displays the right information
    // In the mock data, "Dentai" is at rank 2
    expect(screen.getByText('Your Current Rank: #2 of 8')).toBeInTheDocument();
  });
});