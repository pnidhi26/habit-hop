import React from 'react';
import teamImage from '../../assets/CSUCHICO_Icon.png';
import avatar1 from '../../assets/temp_avatar.png';
import avatar2 from '../../assets/temp_avatar.png';
import avatar3 from '../../assets/temp_avatar.png';
import avatar4 from '../../assets/temp_avatar.png';
import avatar5 from '../../assets/temp_avatar.png';
import avatar6 from '../../assets/temp_avatar.png';

const teamMembers = [
  {
    name: 'Boxi Chen',
    role: 'Team Lead & Scrum Master',
    email: 'Bchen1@csuchico.edu',
    G_id: 'K3rpa',
    avatar: avatar1
  },
  {
    name: 'Prakash Nidhi Verma',
    role: 'Lead Developer & Code Reviewer',
    email: 'pnverma@csuchico.edu',
    G_id: 'pnidhi26',
    avatar: avatar2
  },
  {
    name: 'Austin Norquist',
    role: 'Software Engineer',
    email: 'anorquist@csuchico.edu',
    G_id: 'n0rq1',
    avatar: avatar3
  },
  {
    name: 'Aditi N More',
    role: 'Software Engineer',
    email: 'anmore@csuchico.edu',
    G_id: 'Adidi More',
    avatar: avatar4
  },
  {
    name: 'Dengtai Wang',
    role: 'Software Engineer',
    email: 'dwang2@csuchico.edu',
    G_id: 'wdtt057',
    avatar: avatar5
  },
  {
    name: 'Brian Herring',
    role: 'Product Owner',
    email: 'BHerring@csuchico.edu',
    G_id: 'herringbd61',
    avatar: avatar6
  },
];

export default function About() {
  return (
    <div className="bg-[#fdfaf6] min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center mb-12">Team</h1>

      <div className="w-full max-w-6xl mx-auto mb-20">
        <div className="grid grid-cols-3 gap-12">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-24 h-24 rounded-full object-cover shadow mb-3"
              />
              <h2 className="text-base font-semibold">{member.name}</h2>
              <p className="text-sm text-gray-700">{member.role}</p>
              <p className="text-sm text-gray-500 break-words">Email: {member.email}</p>
              <p className="text-sm text-gray-500">Github: {member.G_id}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-12 border-t border-gray-300">
        <div className="flex gap-12 items-start">
          <div className="w-[35%]">
            <img
              src={teamImage}
              alt="Illustration"
              className="w-full h-auto rounded shadow-md"
            />
          </div>
          <div className="w-[65%]">
            <h2 className="text-3xl font-bold mb-4">About HabitHop</h2>
            <blockquote className="text-lg italic text-green-800 border-l-4 pl-4 border-green-600 mb-4">
              "HabitHop is about helping people design the life they want — one habit at a time."
            </blockquote>
            <p className="text-gray-700 mb-4">
              At HabitHop, we believe that great habits create great lives. Our mission is to empower individuals to build, schedule, and track their daily routines in a way that's structured, motivating, and enjoyable.
            </p>
            <p className="text-gray-700 mb-4">
              Whether you're a seasoned productivity enthusiast or just beginning your habit journey, HabitHop offers a supportive environment where routines become rituals — and consistency becomes second nature.
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>A smooth onboarding experience with easy account creation and login</li>
              <li>A curated library of 12+ meaningful habits with images and descriptions</li>
              <li>Tools to create custom habits, privately or publicly shared</li>
              <li>A flexible weekly planner using a repeating 7-day template</li>
              <li>Daily scheduling across morning, midday, and evening blocks</li>
              <li>Support for scheduling the same habit multiple times per day</li>
              <li>Detailed tracking of time spent per task and weekly completion</li>
              <li>Charts showing habit trends across up to 52 weeks</li>
              <li>A motivational leaderboard and a community sharing space</li>
              <li>FAQ and Switch Bar to personalize the user experience</li>
            </ul>
            <p className="text-gray-700">
              With HabitHop, every day becomes a fresh opportunity to show up for yourself.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
