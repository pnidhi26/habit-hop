import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Analytics from '../Analytics';

// Mock the recharts components since they use SVG which isn't fully supported in jest DOM environment
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="recharts-responsive-container">{children}</div>,
  LineChart: ({ children }) => <div data-testid="recharts-line-chart">{children}</div>,
  Line: () => <div data-testid="recharts-line" />,
  XAxis: () => <div data-testid="recharts-xaxis" />,
  YAxis: () => <div data-testid="recharts-yaxis" />,
  CartesianGrid: () => <div data-testid="recharts-cartesian-grid" />,
  Tooltip: () => <div data-testid="recharts-tooltip" />,
}));

// Mock the lucide-react icons
jest.mock('lucide-react', () => ({
  Calendar: () => <div data-testid="lucide-calendar" />,
  Clock: () => <div data-testid="lucide-clock" />,
  Activity: () => <div data-testid="lucide-activity" />,
}));

describe('Analytics Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders the analytics dashboard title', () => {
    render(<Analytics />);
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
  });

  test('renders the user profile section', () => {
    render(<Analytics />);
    expect(screen.getByText('Prakash Nidhi Verma')).toBeInTheDocument();
    expect(screen.getByText('Student @ CSU Chico')).toBeInTheDocument();
  });

  test('renders lifetime statistics correctly', () => {
    render(<Analytics />);
    expect(screen.getByText('Lifetime statistics')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('Days')).toBeInTheDocument();
    expect(screen.getByText('782')).toBeInTheDocument();
    expect(screen.getByText('95.4%')).toBeInTheDocument();
    expect(screen.getByText('Completion Rate')).toBeInTheDocument();
  });

  test('renders personal report highlights section', () => {
    render(<Analytics />);
    expect(screen.getByText('Personal Report Highlights')).toBeInTheDocument();
    expect(screen.getByText('Last Friday was your lowest percentage of habits completed at 67%')).toBeInTheDocument();
    expect(screen.getByText('If you completed your Friday habits, you would have had a 96% completion rate!')).toBeInTheDocument();
    expect(screen.getByText('You tend to skip your morning habits!')).toBeInTheDocument();
  });

  test('renders habit filter buttons and allows selection', () => {
    render(<Analytics />);
    
    // Check if all habit buttons are rendered
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Habit 1')).toBeInTheDocument();
    expect(screen.getByText('Habit 2')).toBeInTheDocument();
    expect(screen.getByText('Habit 3')).toBeInTheDocument();
    expect(screen.getByText('Habit 4')).toBeInTheDocument();
    expect(screen.getByText('Habit 5')).toBeInTheDocument();
    
    // Initially 'All' should be selected
    expect(screen.getByText('All')).toHaveClass('bg-purple-500');
    
    // Click on 'Habit 1' and verify it gets selected
    fireEvent.click(screen.getByText('Habit 1'));
    expect(screen.getByText('Habit 1')).toHaveClass('bg-purple-500');
    expect(screen.getByText('All')).not.toHaveClass('bg-purple-500');
  });

  test('renders the LineChart component for habit data', () => {
    render(<Analytics />);
    expect(screen.getByTestId('recharts-responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('recharts-line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('recharts-line')).toBeInTheDocument();
  });

  test('renders weekly report section with correct stats', () => {
    render(<Analytics />);
    expect(screen.getByText('Weekly Report')).toBeInTheDocument();
    expect(screen.getByText('98.7%')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('New Habits')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  test('renders calendar year buttons', () => {
    render(<Analytics />);
    expect(screen.getByText('2021')).toBeInTheDocument();
    expect(screen.getByText('2022')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(screen.getByText('2025')).toBeInTheDocument();
    
    // 2025 should be selected by default
    expect(screen.getByText('2025')).toHaveClass('bg-purple-500');
  });

  test('renders calendar month headers', () => {
    render(<Analytics />);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    months.forEach(month => {
      expect(screen.getByText(month)).toBeInTheDocument();
    });
  });

  test('renders calendar day headers', () => {
    render(<Analytics />);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });
});