import React, { useState, useEffect } from 'react';
import defaultUser from '../../data/dummyUser';
import sampleProfilePic from '../../assets/sampleProfilePic.jpeg';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import { updateUserProfile } from '../../api/userApi';

export default function Account() {
  const [user, setUser] = useState(defaultUser);
  const [form, setForm] = useState(defaultUser);
  const [selectedImageFile, setSelectedImageFile] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('dummyUser');
    if (stored) {
      const parsed = JSON.parse(stored);
      parsed.profilePicture = parsed.profileImage;
      setUser(parsed);
      setForm(parsed);
    }
  }, []);

  const handleReset = () => {
    setForm({ ...user });
    setSelectedImageFile(null);
    window.location.reload();
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        username: form.username,
        email: form.email,
        profileImage: selectedImageFile,
      };

    const updated = await updateUserProfile(payload);
    alert('User info updated!');
    setUser(updated.user);
    setForm({
      ...updated.user,
      profilePicture: updated.user.profileImage
    });
    localStorage.setItem('dummyUser', JSON.stringify(updated.user));
    window.location.reload();
    }
    catch (err) {
      alert(err.message);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, profilePicture: reader.result });
      setIsModalOpen(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-md p-6 mt-6">
      <h2 className="text-2xl font-bold mb-6">Basic Info</h2>

      {/* Profile Picture */}
      <div className="flex items-center justify-between mb-4 border-b pb-4">
        <p>Profile Picture</p>
        <img
          src={form.profilePicture || sampleProfilePic}
          alt="Profile"
          onClick={() => setIsModalOpen(true)}
          className="w-16 h-16 rounded-full object-cover cursor-pointer border-2 border-white shadow"
        />
      </div>

      {/* Username */}
      <div className="flex justify-between mb-4 border-b pb-4">
        <p>Name</p>
        <input
          type="text"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="text-right border-none outline-none bg-transparent"
        />
      </div>

      {/* Email */}
      <div className="flex justify-between mb-4 border-b pb-4">
        <p>Email</p>
        <input
          type="email"
          value={form.email}
          readOnly
          className="text-right border-none outline-none bg-transparent"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end mt-6 gap-4">
        <button
          onClick={handleReset}
          className="border px-4 py-1 rounded hover:bg-gray-100"
        >
          Reset
        </button>
        <button
          onClick={handleUpdate}
          className="border px-4 py-1 rounded hover:bg-gray-100"
        >
          Update
        </button>
      </div>

      {/* Modal for image upload */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-gray-200 p-6 rounded-lg relative w-80">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              onClick={() => setIsModalOpen(false)}
            >
              <CloseIcon />
            </button>
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow mb-4">
                <ImageIcon style={{ fontSize: 50, color: '#888' }} />
              </div>
              <label className="bg-white px-4 py-1 rounded cursor-pointer hover:bg-gray-100">
                Upload Picture
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
