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
    name: 'Prakash Nidhi Verma',
    role: 'x',
    email: 'pnverma@csuchico.edu',
    G_id: 'pnidhi26',
    avatar: avatar1
  },
  {
    name: 'Dengtai Wang',
    role: 'x',
    email: 'dwang2@csuchico.edu',
    G_id: 'wdtt057',
    avatar: avatar2
  },
  {
    name: 'Austin Norquist',
    role: 'x',
    email: 'anorquist@csuchico.edu',
    G_id: 'n0rq1',
    avatar: avatar3
  },
  {
    name: 'Boxi Chen',
    role: 'x',
    email: 'Bchen1@csuchico.edu',
    G_id: 'K3rpa',
    avatar: avatar4
  },
  {
    name: 'Aditi N More',
    role: 'x',
    email: 'anmore@csuchico.edu',
    G_id: 'Adidi More',
    avatar: avatar5
  },
  {
    name: 'Brian Herring',
    role: 'x',
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
            <h2 className="text-3xl font-bold mb-4">Philosophy</h2>
            <blockquote className="text-lg italic text-green-800 border-l-4 pl-4 border-green-600 mb-4">
              "Food Studio is about sharing stories of people that believe in good and honest food."
            </blockquote>
            <p className="text-gray-700">
              With good and honest food we mean food that both tastes good, has a positive impact on our health,
              food that’s responsibly produced, food that’s a result of plants and animals being treated well,
              and food that inspires us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
