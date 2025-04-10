import React, { useState } from 'react';
import '../styles/Signup.css';
import { signup } from '../api/auth'; // Import the signup function

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // 'isLoading' is now used

  const handleChange = (e) => { // 'handleChange' is now used
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'username':
        if (!value.trim()) error = 'Username is required';
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email address';
        break;
      case 'password':
        if (value.length < 8) {
          error = 'Password must be at least 8 characters';
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value)) {
          error = 'Password must include uppercase, lowercase, and a number';
        }
        break;
      case 'confirmPassword':
        if (value !== formData.password) error = 'Passwords do not match';
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => { // 'handleSubmit' is now used
    e.preventDefault();

    const newErrors = {};
    Object.entries(formData).forEach(([name, value]) => {
      validateField(name, value);
      if (errors[name]) {
        newErrors[name] = errors[name];
      }
    });

    if (Object.values(newErrors).some((err) => err)) return;

    setIsLoading(true); // Set loading state to true when the request starts
    try {
      const signupData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };
      const responseData = await signup(signupData);
      console.log('Signup successful:', responseData);
      alert('Account created successfully! Please log in.');
      window.location.href = '/login';
      setFormData({ username: '', email: '', password: '', confirmPassword: '' });
      setErrors({});
    } catch (error) {
      console.error('Signup failed:', error);
      if (error.field && error.message) {
        setErrors(prev => ({ ...prev, [error.field]: error.message }));
      } else if (error.message) {
        setErrors(prev => ({ ...prev, general: error.message || 'Signup failed. Please try again.' }));
      } else {
        setErrors(prev => ({ ...prev, general: 'Network error. Please try again later.' }));
      }
    } finally {
      setIsLoading(false); // Set loading state back to false when the request finishes
    }
  };

  return (
    <div className="signup-container">
      <a href="/" className="back-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span className="text-2xl font-bold text-white ml-2">Back HabitHop</span>
      </a>

      {/* Wave background */}
      <div className="wave-container">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#ffffff" fillOpacity="1" d="M0,224L80,213.3C160,203,320,181,480,181.3C640,181,800,203,960,213.3C1120,224,1280,224,1360,224L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          <path fill="#f3f7fd" fillOpacity="0.6" d="M0,192L60,186.7C120,181,240,171,360,186.7C480,203,600,245,720,240C840,235,960,181,1080,176C1200,171,1320,213,1380,234.7L1440,256L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>

      <div className="signup-header">
        <h2>Create your HabitHop Account</h2>
        <p>Organize, Execute, Triumph</p>
      </div>

      <div className="form-container">
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? 'error-input' : ''}
              />
              {errors.username && <p className="error-message">{errors.username}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error-input' : ''}
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error-input' : ''}
              />
              {errors.password && <p className="error-message">{errors.password}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error-input' : ''}
              />
              {errors.confirmPassword && (
                <p className="error-message">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="form-group">
              <button type="submit" className="submit-button" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Start Building Habits Today'}
              </button>
            </div>

            <div className="login-link">
              <p>Already have an account? <a href="/login">Login</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;