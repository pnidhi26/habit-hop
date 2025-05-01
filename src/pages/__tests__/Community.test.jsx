import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Community from '../Community'; // Adjust path as needed

describe('Community Component', () => {
  test('renders the component with initial posts', () => {
    render(<Community />);
    
    // Check if posts are rendered by username
    expect(screen.getByText('Prakash')).toBeInTheDocument();
    expect(screen.getByText('Boxi')).toBeInTheDocument();
    expect(screen.getByText('User 3')).toBeInTheDocument();
    expect(screen.getByText('Aditi')).toBeInTheDocument();
    
    // Check if all posts have the same title
    const postTitles = screen.getAllByText('This is my hack to completing my tasks efficiently!');
    expect(postTitles).toHaveLength(4);
  });

  test('toggles filter sidebar visibility', () => {
    render(<Community />);
    
    // Initially the filter sidebar should be visible with "Sort By" text
    expect(screen.getByText('Sort By')).toBeInTheDocument();
    
    // Find and click the toggle button using test id
    const toggleButton = screen.getByTestId('sidebar-toggle');
    fireEvent.click(toggleButton);
    
    // Click again to show the sidebar
    fireEvent.click(toggleButton);
    expect(screen.getByText('Sort By')).toBeInTheDocument();
  });


  test('toggles save/bookmark functionality', () => {
    render(<Community />);
    
    // Find bookmark buttons by test id
    const bookmarkButtons = screen.getAllByTestId('bookmark-button');
    
    // Click the first save button
    fireEvent.click(bookmarkButtons[0]);
    
    // Check for the yellow color class
    expect(bookmarkButtons[0]).toHaveClass('text-yellow-500');
  });

  test('toggles like functionality', () => {
    render(<Community />);
    
    // Find like buttons by test id
    const likeButtons = screen.getAllByTestId('like-button');
    
    // Click the first like button
    fireEvent.click(likeButtons[0]);
    
    // Check for the red color class
    expect(likeButtons[0]).toHaveClass('text-red-500');
  });

  test('shows and hides create post modal', () => {
    render(<Community />);
    
    // Find the Plus button by test id
    const plusButton = screen.getByTestId('create-post-button');
    fireEvent.click(plusButton);
    
    // Check if modal is displayed
    expect(screen.getByText('Create New Post')).toBeInTheDocument();
    expect(screen.getByText('Add a title')).toBeInTheDocument();
    
    // Find the close button and click it
    const closeButton = screen.getByTestId('close-modal-button');
    fireEvent.click(closeButton);
    
    // Check if modal is hidden
    expect(screen.queryByText('Create New Post')).not.toBeInTheDocument();
  });

  test('creates new post', () => {
    render(<Community />);
    
    // Open the modal
    const plusButton = screen.getByTestId('create-post-button');
    fireEvent.click(plusButton);
    
    // Fill in the form
    const titleInput = screen.getByPlaceholderText('Lorem Ipsum is simply dummy text of the printing');
    const bodyInput = screen.getByPlaceholderText(/It is a long established fact/i);
    
    fireEvent.change(titleInput, { target: { value: 'Test Post Title' } });
    fireEvent.change(bodyInput, { target: { value: 'Test Post Content' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'Post!' });
    fireEvent.click(submitButton);
    
    // Check if the new post appears
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    
    // The modal should be closed
    expect(screen.queryByText('Create New Post')).not.toBeInTheDocument();
  });

});