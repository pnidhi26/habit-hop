import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Account from '../settings/account';
import * as api from '../../api/userApi';

jest.mock('../../api/userApi', () => ({
  updateUserProfile: jest.fn(),
}));

beforeAll(() => {
  window.alert = jest.fn();
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: {
      ...window.location,
      reload: jest.fn(),
    },
  });
  jest.spyOn(Storage.prototype, 'setItem');
});

describe('Account Page', () => {
  const dummyUser = {
    username: 'Super Nerd',
    email: 'iamnerd@gmail.com',
    profileImage: 'data:image/png;base64,dummy',
    profilePicture: 'data:image/png;base64,dummy',
  };

  beforeEach(() => {
    // Mock FileReader to simulate image upload preview
    global.FileReader = class {
      constructor() {
        this.onloadend = null;
      }
      readAsDataURL() {
        this.result = 'data:image/jpeg;base64,mocked';
        if (this.onloadend) this.onloadend();
      }
    };

    const withProfilePicture = {
      ...dummyUser,
      profilePicture: dummyUser.profileImage,
    };
    localStorage.setItem('dummyUser', JSON.stringify(withProfilePicture));
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  
  test('renders Account component without crashing', () => {
    render(<Account />);
    expect(screen.getByText('Basic Info')).toBeInTheDocument();
  });
  
  

  test('updates username, calls API, and sets localStorage', async () => {
    const updatedUser = {
      username: 'Updated Nerd',
      email: dummyUser.email,
      profileImage: dummyUser.profileImage,
    };

    api.updateUserProfile.mockResolvedValue({ user: updatedUser });

    render(<Account />);
    const nameInput = screen.getByDisplayValue(dummyUser.username);
    fireEvent.change(nameInput, { target: { value: updatedUser.username } });
    fireEvent.click(screen.getByText('Update'));

    await waitFor(() =>
      expect(api.updateUserProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          username: updatedUser.username,
          email: updatedUser.email,
        })
      )
    );

    await waitFor(() =>
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'dummyUser',
        JSON.stringify(updatedUser)
      )
    );
  });

  test('resets form when Reset button is clicked', () => {
    render(<Account />);
    const nameInput = screen.getByDisplayValue(dummyUser.username);
    fireEvent.change(nameInput, { target: { value: 'Changed Name' } });
    fireEvent.click(screen.getByText('Reset'));
    expect(window.location.reload).toHaveBeenCalled();
  });

  test('opens modal when profile image is clicked', () => {
    render(<Account />);
    const img = screen.getByAltText('Profile');
    fireEvent.click(img);
    expect(screen.getByText('Upload Picture')).toBeInTheDocument();
  });

  test('uploads image and updates preview (FileReader)', async () => {
    render(<Account />);
    const file = new File(['dummy content'], 'cat.jpg', { type: 'image/jpeg' });

    fireEvent.click(screen.getByAltText('Profile'));
    const inputWrapper = screen.getByText('Upload Picture').parentElement;
    const fileInput = inputWrapper.querySelector('input[type="file"]');

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const updatedImg = screen.getByAltText('Profile');
      expect(updatedImg.src).toBe('data:image/jpeg;base64,mocked');
    });
  });
});
