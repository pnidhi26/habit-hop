// src/pages/AddHabit.jsx   (or AddHabit.js if that’s how your project names files)

import React, { useState } from 'react';
import { useNavigate }   from 'react-router-dom';
import { createHabit }   from '../api/habits';
import './css/Habits.css';

/* ---------- initial form state ---------- */
const defaultState = {
  habitName   : '',
  description : '',
  imageFile   : null,
  minTime     : '',
  maxTime     : '',
  timeBlock   : 'morning',
};

export default function AddHabit() {
  const [form,    setForm]    = useState(defaultState);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const  navigate             = useNavigate();

  /* ---------- handlers ---------- */
  function handleChange(e) {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: name === 'imageFile' ? (files[0] || null) : value,
    }));
  }

  /* convert selected image file → base-64 string */
  function encodeImage(file) {
    if (!file) return Promise.resolve(null);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError(null);

    try {
      const img = await encodeImage(form.imageFile);
      await createHabit({
        habitName          : form.habitName,
        description        : form.description,
        minTime            : Number(form.minTime),
        maxTime            : Number(form.maxTime),
        preferredTimeBlock : form.timeBlock,
        image              : img,
      });
      setForm(defaultState);          // clear the form
      navigate('/habits');            // go back to Habit list
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    navigate('/habits');
  }

  /* ---------- UI ---------- */
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create a New Habit</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Habit Name -------------------------------------------------- */}
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

        {/* Description -------------------------------------------------- */}
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

        {/* Image -------------------------------------------------------- */}
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

        {/* Min / Max time --------------------------------------------- */}
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

        {/* Preferred time block ---------------------------------------- */}
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

        {/* Error message ---------------------------------------------- */}
        {error && <p className="text-red-600">{error}</p>}

        {/* Buttons ----------------------------------------------------- */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 bg-indigo-500 text-white py-2 rounded font-semibold hover:bg-indigo-600
                        ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Saving…' : 'Create Habit'}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-gray-300 text-gray-800 py-2 rounded font-semibold hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
