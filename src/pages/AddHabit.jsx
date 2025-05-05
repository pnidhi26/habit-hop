import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createHabit } from '../api/habits';
import { jwtDecode } from 'jwt-decode';
import '../styles/Habits.css';

const defaultState = {
  habitName: '',
  description: '',
  imageFile: null
};

export default function AddHabit() {
  const [form, setForm] = useState(defaultState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const token = localStorage.getItem('authToken');
  const decoded = jwtDecode(token);
  const userId = decoded.userId;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageFile') {
      console.log('Selected image:', files[0]);  
    }
    setForm(f => ({
      ...f,
      [name]: name === 'imageFile' ? (files[0] || null) : value,
    }));
  };

  const encodeImage = async (file) => {
    if (!file) return null; 

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result); 
      };
      reader.onerror = (error) => {
        console.error('Error encoding file:', error);  
        reject('Failed to encode image');
      };
      reader.readAsDataURL(file);  
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const formData = new FormData();
      formData.append('habitName', form.habitName);
      formData.append('habitDescription', form.description);
      if (form.imageFile) {
        formData.append('habitImage', form.imageFile);
      }
  
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `https://habitstacker-821782230505.us-west1.run.app/api/createHabit/${userId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
  
      const data = await response.json();
      if (data.success) {
        setForm(defaultState);
        navigate('/habits');
      } else {
        throw new Error(data.message || 'Failed to create habit');
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