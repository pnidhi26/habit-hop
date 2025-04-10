import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Download from '../Download';
import '@testing-library/jest-dom'; // ✅ Add this line

describe('Download Component', () => {
  test('renders Skip to Dashboard button and navigates to /dashboard', async () => {
    render(
      <MemoryRouter>
        <Download />
      </MemoryRouter>
    );

    const skipButton = screen.getByText(/Skip to Dashboard/i);
    expect(skipButton).toBeInTheDocument();

    await userEvent.click(skipButton);
    expect(skipButton.closest('a')).toHaveAttribute('href', '/dashboard');
  });
});