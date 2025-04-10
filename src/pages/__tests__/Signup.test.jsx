import '@testing-library/jest-dom';
import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Signup from '../Signup';
import * as authApi from '../../api/auth';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../api/auth');

global.alert = jest.fn();
delete window.location;
window.location = { href: '' };

describe('Signup Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all fields and submit button', () => {
    render(<Signup />, { wrapper: MemoryRouter });
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Start Building Habits Today/i })
    ).toBeInTheDocument();
  });

  it('shows error when passwords do not match', async () => {
    render(<Signup />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'u' },
    });
    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'e@e.com' },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'pass1' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'pass2' },
    });

    userEvent.click(
      screen.getByRole('button', { name: /Start Building Habits Today/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('shows error for invalid email', async () => {
    render(<Signup />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'u' },
    });
    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'invalid' },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'Password1' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'Password1' },
    });

    userEvent.click(
      screen.getByRole('button', { name: /Start Building Habits Today/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
    });
  });

  it('calls signup API and redirects on success', async () => {
    authApi.signup.mockResolvedValueOnce({ success: true });

    render(<Signup />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'Password123' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'Password123' },
    });

    userEvent.click(
      screen.getByRole('button', { name: /Start Building Habits Today/i })
    );

    await waitFor(() => {
      expect(authApi.signup).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123',
      });
      expect(global.alert).toHaveBeenCalledWith(
        'Account created successfully! Please log in.'
      );
      expect(window.location.href).toBe('/login');
    });
  });

  it('shows error when username is empty', async () => {
    render(<Signup />, { wrapper: MemoryRouter });

    // leave username blank
    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'Password123' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'Password123' },
    });

    userEvent.click(
      screen.getByRole('button', { name: /Start Building Habits Today/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/Username is required/i)).toBeInTheDocument();
    });
  });

  it('shows password strength errors', async () => {
    render(<Signup />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'user' },
    });
    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'e@e.com' },
    });

    // too short
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'Ab1' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'Ab1' },
    });
    userEvent.click(
      screen.getByRole('button', { name: /Start Building Habits Today/i })
    );
    await waitFor(() => {
      expect(
        screen.getByText(/Password must be at least 8 characters/i)
      ).toBeInTheDocument();
    });

    // missing complexity
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'abcdefgh' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'abcdefgh' },
    });
    userEvent.click(
      screen.getByRole('button', { name: /Start Building Habits Today/i })
    );
    await waitFor(() => {
      expect(
        screen.getByText(
          /Password must include uppercase, lowercase, and a number/i
        )
      ).toBeInTheDocument();
    });
  });

  it('disables button and shows loading text while signing up', async () => {
    let resolvePromise;
    authApi.signup.mockImplementation(
      () =>
        new Promise(res => {
          resolvePromise = res;
        })
    );

    render(<Signup />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'user' },
    });
    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'Password123' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'Password123' },
    });

    const btn = screen.getByRole('button', {
      name: /Start Building Habits Today/i,
    });
    userEvent.click(btn);

    // wait for loading state
    await waitFor(() => {
      expect(btn).toBeDisabled();
      expect(btn).toHaveTextContent(/Creating Account.../i);
    });

    // resolve the API call
    resolvePromise({ success: true });

    // wait for loading to clear
    await waitFor(() => {
      expect(btn).not.toBeDisabled();
      expect(btn).toHaveTextContent(/Start Building Habits Today/i);
    });
  });
});
