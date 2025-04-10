import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Signup from '../Signup';
import '@testing-library/jest-dom';

describe('Signup Component', () => {
  test('renders signup form with all fields and button', () => {
    render(<Signup />);
    
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start Building Habits Today/i })).toBeInTheDocument();
  });

  test('displays error for invalid email', () => {
    render(<Signup />);
    const emailInput = screen.getByLabelText(/Email address/i);
    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
    fireEvent.blur(emailInput); // Triggers validation
    expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
  });

  test('disables submit button when loading', () => {
    render(<Signup />);
    const button = screen.getByRole('button', { name: /Start Building Habits Today/i });
    fireEvent.click(button);
    expect(button).toBeDisabled();
  });
});
