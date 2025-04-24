import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

/* Mock the API wrapper BEFORE importing the component */
jest.mock('../../api/habits', () => ({
  createHabit: jest.fn().mockResolvedValue({ success: true }),
}));
import { createHabit } from '../../api/habits';

import AddHabit from '../AddHabit';

describe('AddHabit Form', () => {
  test('renders all form fields and buttons', () => {
    render(<AddHabit />, { wrapper: MemoryRouter });

    expect(screen.getByLabelText(/habit name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/upload image/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/minimum time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/maximum time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/preferred time block/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create habit/i }))
      .toBeInTheDocument();
  });

  test('submits form and calls createHabit()', async () => {
    render(<AddHabit />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/habit name/i),
      { target: { value: 'Test Habit' } });
    fireEvent.change(screen.getByLabelText(/description/i),
      { target: { value: 'This is a test' } });
    fireEvent.change(screen.getByLabelText(/minimum time/i),
      { target: { value: 5 } });
    fireEvent.change(screen.getByLabelText(/maximum time/i),
      { target: { value: 15 } });

    fireEvent.click(screen.getByRole('button', { name: /create habit/i }));

    await waitFor(() =>
      expect(createHabit).toHaveBeenCalledWith(
        expect.objectContaining({
          habitName: 'Test Habit',
          description: 'This is a test',
        })
      )
    );
  });
});
