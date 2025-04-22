import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddHabit() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    habitName: '',
    habitDescription: '',
    habitImage: null,
    habitMinTime: '',
    habitMaxTime: '',
    preferredTime: '',
    startTime: '',
    endTime: '',
    daysOfWeek: [],
  });

  const [showTimeBlock, setShowTimeBlock] = useState(false);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    if (type === 'checkbox') {
      setForm((prev) => ({
        ...prev,
        daysOfWeek: checked
          ? [...prev.daysOfWeek, value]
          : prev.daysOfWeek.filter((day) => day !== value),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: files ? files[0] : value,
      }));
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 py-10">
      <form
        className="bg-gradient-to-br from-[#5A80FF] to-[#9F5BFF] text-white p-8 rounded-xl shadow-2xl w-full max-w-md"
        onSubmit={(e) => e.preventDefault()}
      >
        <h2 className="text-2xl font-bold text-center mb-6">Add a New Habit</h2>

        {/* 1. Habit Name */}
        <label className="block mb-1 font-medium">1. Habit Name *</label>
        <input
          type="text"
          name="habitName"
          required
          className="w-full p-2 mb-4 rounded border border-white bg-transparent placeholder-white text-white"
          placeholder="Enter habit name"
          onChange={handleChange}
        />

        {/* 2. Description */}
        <label className="block mb-1 font-medium">2. Description *</label>
        <input
          type="text"
          name="habitDescription"
          required
          className="w-full p-2 mb-4 rounded border border-white bg-transparent placeholder-white text-white"
          placeholder="Describe your habit"
          onChange={handleChange}
        />

        {/* 3. Image Upload */}
        <label className="block mb-1 font-medium">3. Add picture *</label>
        <input
          type="file"
          name="habitImage"
          accept="image/*"
          required
          className="w-full p-2 mb-4 rounded border border-white bg-transparent text-white"
          onChange={handleChange}
        />

        {/* 4. Time Estimate */}
        <label className="block mb-1 font-medium">4. Enter time estimate</label>
        <div className="flex gap-4 mb-4">
          <input
            type="number"
            name="habitMinTime"
            placeholder="Min"
            className="w-1/2 p-2 rounded border border-white bg-transparent placeholder-white text-white"
            onChange={handleChange}
          />
          <input
            type="number"
            name="habitMaxTime"
            placeholder="Max"
            className="w-1/2 p-2 rounded border border-white bg-transparent placeholder-white text-white"
            onChange={handleChange}
          />
        </div>

        {/* 5. Target Time Block Dropdown */}
        <label className="block mb-1 font-medium">5. Target time block</label>
        <div className="relative mb-4">
          <button
            type="button"
            onClick={() => setShowTimeBlock(!showTimeBlock)}
            className="w-full p-2 rounded border border-white bg-transparent text-white flex justify-between items-center"
          >
            {form.preferredTime || 'Select time block'}
            <span>{showTimeBlock ? '▲' : '▼'}</span>
          </button>
          {showTimeBlock && (
            <ul className="absolute left-0 right-0 mt-1 bg-white text-black rounded shadow-lg z-10">
              {['Morning', 'Midday', 'Evening'].map((option) => (
                <li
                  key={option}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setForm((prev) => ({ ...prev, preferredTime: option }));
                    setShowTimeBlock(false);
                  }}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 6. Start Time */}
        <label className="block mb-1 font-medium">6. Start Time *</label>
        <input
          type="time"
          name="startTime"
          required
          className="w-full p-2 mb-4 rounded border border-white bg-transparent text-white"
          onChange={handleChange}
        />

        {/* 7. End Time */}
        <label className="block mb-1 font-medium">7. End Time *</label>
        <input
          type="time"
          name="endTime"
          required
          className="w-full p-2 mb-4 rounded border border-white bg-transparent text-white"
          onChange={handleChange}
        />


        {/* Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            className="bg-white text-indigo-600 px-4 py-2 rounded hover:bg-gray-200 font-semibold"
            onClick={() => navigate('/habits')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-white text-indigo-600 px-6 py-2 rounded hover:bg-gray-200 font-semibold"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
