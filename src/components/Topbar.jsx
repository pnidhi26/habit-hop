import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sampleProfilePic from '../assets/sampleProfilePic.jpeg';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

export default function Topbar() {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(sampleProfilePic);

  useEffect(() => {
    const stored = localStorage.getItem('dummyUser');
    if (stored) {
      const user = JSON.parse(stored);
      
      if (user.profileImage && user.profileImage !== null) {
        setProfileImage(user.profileImage);
      }
    }
  }, []);
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleLeaderboard = () => {
    navigate('/leaderboard');
  };

  return (
    <div className="bg-gray-900 text-white flex justify-between items-center p-4 shadow w-full">
      <div className="text-2xl font-bold">HabitHop</div>
      <div className="flex items-center gap-2">
        <IconButton onClick={handleLeaderboard} sx={{ color: 'white' }}>
          <EmojiEventsIcon />
        </IconButton>
        <img 
          src={profileImage} 
          alt="User" 
          className="w-10 h-10 rounded-full object-cover"
        />
        <IconButton onClick={handleLogout} sx={{ color: 'white' }}>
          <LogoutIcon />
        </IconButton>
      </div>
    </div>
  );
}