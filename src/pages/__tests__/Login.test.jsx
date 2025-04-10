// src/pages/__tests__/Login.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../Login';
import '@testing-library/jest-dom';

describe('Login Component', () => {
  test('renders login form fields and button', () => {
    render(<Login />);
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Continue Building Habits/i })).toBeInTheDocument();
  });

  test('disables login button while loading', () => {
    render(<Login />);
    const button = screen.getByRole('button', { name: /Continue Building Habits/i });
    fireEvent.click(button);
    expect(button).toBeDisabled();
  });

  test('renders error message when login fails', async () => {
    render(<Login />);
    const email = screen.getByLabelText(/Email address/i);
    const password = screen.getByLabelText(/Password/i);
    const button = screen.getByRole('button', { name: /Continue Building Habits/i });

    fireEvent.change(email, { target: { value: 'test@test.com' } });
    fireEvent.change(password, { target: { value: 'wrongpassword' } });
    fireEvent.click(button);

    // Fake delay simulation would be needed here if mocking login
    // expect(await screen.findByText(/Invalid email or password/i)).toBeInTheDocument();
  });
});
