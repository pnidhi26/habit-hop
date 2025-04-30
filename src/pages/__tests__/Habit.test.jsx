import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Habits from '../Habits';
import '@testing-library/jest-dom';


describe('Habits Page', () => {
  test('renders all predefined habit names (each appears twice)', () => {
    render(<Habits />, { wrapper: MemoryRouter });

    const habitNames = [
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
      'Cooking',
    ];

    habitNames.forEach((name) => {
      // card-back title + caption under the card
      expect(screen.getAllByText(name)).toHaveLength(2);
    });
  });

  test('renders habit descriptions when cards are flipped (descriptions are in the DOM)', () => {
    render(<Habits />, { wrapper: MemoryRouter });

    const descriptions = [
      'Improve flexibility and calm your mind through controlled poses and breathing.',
      'Build strength and stamina with weight training and cardio workouts.',
      'Reduce stress and improve focus through mindful breathing.',
    ];

    descriptions.forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  test('renders all action buttons', () => {
    render(<Habits />, { wrapper: MemoryRouter });

    expect(screen.getByRole('button', { name: /select/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /join habit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /\+ add new habit/i })).toBeInTheDocument();
  });
});
