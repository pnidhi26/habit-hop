import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../Login';
import '@testing-library/jest-dom';

jest.mock('../../api/auth', () => ({
  login: jest.fn(() => Promise.resolve({ token: '12345' })),
}));

describe('Login Component', () => {
  test('renders login form with email and password', () => {
    render(<Login />);

    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Continue Building Habits/i })).toBeInTheDocument();
  });

  test('disables button while logging in and calls login API', async () => {
    const { login } = require('../../api/auth');

    render(<Login />);
    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'Password123' } });

    const button = screen.getByRole('button', { name: /Continue Building Habits/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'Password123',
      });
      expect(button).toBeDisabled();
    });
  });
});
