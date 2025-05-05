const API_BASE_URL = 'https://habitstacker-821782230505.us-west1.run.app/api/auth';

export const updateUserProfile = async (form) => {
  const formData = new FormData();
  formData.append("username", form.username);
  formData.append("email", form.email);
  if (form.profileImage) {
    formData.append("profileImage", form.profileImage);
  }

  const response = await fetch(`${API_BASE_URL}/updateProfile`, {
    method: "PUT",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update profile");
  }

  return data;
};
