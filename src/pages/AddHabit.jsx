// src/pages/AddHabit.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createHabit } from '../api/habits';
import './css/Habits.css';

const defaultState = {
  habitName: '',
  description: '',
  imageFile: null,
  minTime: '',
  maxTime: '',
  timeBlock: 'morning',
};

export default function AddHabit() {
  const [form, setForm] = useState(defaultState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: name === 'imageFile' ? (files[0] || null) : value,
    }));
  };

  const encodeImage = async (file) => {
    if (!file) return null;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const img = await encodeImage(form.imageFile);
      
      const payload = {
        habitName: form.habitName,
        description: form.description,
        minTime: Number(form.minTime),
        maxTime: Number(form.maxTime),
        preferredTimeBlock: form.timeBlock,
        image: img,
      };

      const response = await createHabit(payload);
      
      if (response.success) {
        setForm(defaultState);
        navigate('/habits');
      } else {
        throw new Error('Failed to create habit');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create a New Habit</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-red-600 bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        <label className="block">
          <span className="font-semibold">Habit Name</span>
          <input
            name="habitName"
            type="text"
            required
            className="mt-1 w-full border p-2 rounded"
            value={form.habitName}
            onChange={handleChange}
          />
        </label>

        <label className="block">
          <span className="font-semibold">Description</span>
          <textarea
            name="description"
            rows="3"
            required
            className="mt-1 w-full border p-2 rounded"
            value={form.description}
            onChange={handleChange}
          />
        </label>

        <label className="block">
          <span className="font-semibold">Upload Image</span>
          <input
            name="imageFile"
            type="file"
            accept="image/*"
            className="mt-1 w-full"
            onChange={handleChange}
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label>
            <span className="font-semibold">Minimum Time (min)</span>
            <input
              name="minTime"
              type="number"
              min="1"
              required
              className="mt-1 w-full border p-2 rounded"
              value={form.minTime}
              onChange={handleChange}
            />
          </label>

          <label>
            <span className="font-semibold">Maximum Time (min)</span>
            <input
              name="maxTime"
              type="number"
              min={form.minTime || 1}
              required
              className="mt-1 w-full border p-2 rounded"
              value={form.maxTime}
              onChange={handleChange}
            />
          </label>
        </div>

        <label className="block">
          <span className="font-semibold">Preferred Time Block</span>
          <select
            name="timeBlock"
            className="mt-1 w-full border p-2 rounded"
            value={form.timeBlock}
            onChange={handleChange}
          >
            <option value="morning">Morning</option>
            <option value="midday">Midday</option>
            <option value="evening">Evening</option>
          </select>
        </label>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 bg-indigo-500 text-white py-2 rounded font-semibold hover:bg-indigo-600
                      ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Creating...' : 'Create Habit'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/habits')}
            className="flex-1 bg-gray-300 text-gray-800 py-2 rounded font-semibold hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
