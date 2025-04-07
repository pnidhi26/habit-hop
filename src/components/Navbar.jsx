import React from 'react';
import { Link, useMatch, useResolvedPath } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="bg-gray-800 text-white w-1/5 min-h-screen p-4 flex flex-col">
      <ul className="space-y-4">
        <CustomLink to="/dashboard">Dashboard</CustomLink>
        <CustomLink to="/habits">Habits</CustomLink>
        <CustomLink to="/plans">Plans</CustomLink>
        <CustomLink to="/analytics">Analytics</CustomLink>
        <CustomLink to="/community">Community</CustomLink>
        <CustomLink to="/settings">Settings</CustomLink>
      </ul>
    </div>
  )
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })

  return (
    <li className={isActive ? "text-blue-400" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  )
}
