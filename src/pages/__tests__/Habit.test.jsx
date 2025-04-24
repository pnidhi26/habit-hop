import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Habits from '../Habits';


describe('Habits Page', () => {
  test('renders all predefined habit names', () => {
    render(<Habits />, { wrapper: MemoryRouter });

    const habitsToTest = [
      'Yoga',
      'Gym',
      'Meditation',
      'Walking',
      'Reading',
      'Stretching',
      'Earthing',
      'Cycling',
      'Dancing',
      'Drinking water',
      'Journaling',
      'Skincare',
      'Digital Detox',
      'Cleaning/Chores',
      'Cooking'
    ];

    habitsToTest.forEach(habit => {
      const matches = screen.getAllByText(habit);
      expect(matches.length).toBeGreaterThan(0);
    });
  });
});
