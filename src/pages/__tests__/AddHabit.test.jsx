// src/pages/__tests__/AddHabit.test.jsx
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AddHabit from '../AddHabit';
import { createHabit } from '../../api/habits';

// ─── mocks ────────────────────────────────────────────────────────────────────
jest.mock('../../api/habits');
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// ─── tests ────────────────────────────────────────────────────────────────────
describe('AddHabit Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(
      <MemoryRouter>
        <AddHabit />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText(/habit name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/upload image/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/minimum time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/maximum time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/preferred time block/i)).toBeInTheDocument();
  });

  it('submits valid form data and navigates back', async () => {
    createHabit.mockResolvedValue({ success: true });

    render(
      <MemoryRouter>
        <AddHabit />
      </MemoryRouter>,
    );

    // fill required fields
    fireEvent.change(screen.getByLabelText(/habit name/i), {
      target: { value: 'Test Habit' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Test Description' },
    });
    fireEvent.change(screen.getByLabelText(/minimum time/i), {
      target: { value: '10' },
    });
    fireEvent.change(screen.getByLabelText(/maximum time/i), {
      target: { value: '30' },
    });

    // **new** — attach a fake file so encodeImage code runs
    const file = new File(['dummy-data'], 'pic.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText(/upload image/i), {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByRole('button', { name: /create habit/i }));

    await waitFor(() => {
      expect(createHabit).toHaveBeenCalledWith({
        habitName: 'Test Habit',
        description: 'Test Description',
        minTime: 10,
        maxTime: 30,
        preferredTimeBlock: 'morning',
        image: expect.any(String), // base-64 string from FileReader
      });
      expect(mockNavigate).toHaveBeenCalledWith('/habits');
    });
  });

  it('shows error banner when API call fails', async () => {
    createHabit.mockRejectedValue(new Error('Failed to create habit'));

    render(
      <MemoryRouter>
        <AddHabit />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/habit name/i), {
      target: { value: 'Test Habit' },
    });
    fireEvent.click(screen.getByRole('button', { name: /create habit/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to create habit/i)).toBeInTheDocument();
    });
  });

  it('navigates back to /habits on cancel', () => {
    render(
      <MemoryRouter>
        <AddHabit />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/habits');
  });

  it('updates max-time min attribute when min-time changes', () => {
    render(
      <MemoryRouter>
        <AddHabit />
      </MemoryRouter>,
    );

    const minInput = screen.getByLabelText(/minimum time/i);
    const maxInput = screen.getByLabelText(/maximum time/i);

    fireEvent.change(minInput, { target: { value: '30' } });
    expect(maxInput).toHaveAttribute('min', '30');

    fireEvent.change(maxInput, { target: { value: '20' } });
    expect(maxInput.value).toBe('20');
  });
});