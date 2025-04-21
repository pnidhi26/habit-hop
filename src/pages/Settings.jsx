import React from 'react';
import SettingNavbar from '../components/Setting_Navbar';
import { Outlet } from 'react-router-dom';

export default function Settings() {
  return (
    <div className="flex h-full">
      <SettingNavbar />
      <div className="flex-1 p-6 bg-white overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}