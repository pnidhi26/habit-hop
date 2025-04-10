import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Button from '../Button';
import '@testing-library/jest-dom'; // ✅ Add this line

describe('Button Component', () => {
  test('renders Start New Habit Today button and navigates to /login', async () => {
    render(
      <MemoryRouter>
        <Button assetUrl="test-img.png" />
      </MemoryRouter>
    );

    const button = screen.getByText(/Start New Habit Today/i);
    expect(button).toBeInTheDocument();

    await userEvent.click(button);
    expect(button.closest('a')).toHaveAttribute('href', '/login');
  });
});
