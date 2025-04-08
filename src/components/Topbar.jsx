import React from 'react';
import sampleProfilePic from '../assets/sampleProfilePic.jpeg';

export default function Topbar() {
  return (
    <div className="bg-gray-900 text-white flex justify-between items-center p-4 shadow w-full">
      <div className="text-2xl font-bold">HabitHop</div>
      <div>
        <img 
          src={sampleProfilePic} 
          alt="User" 
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>
    </div>
  );
}
