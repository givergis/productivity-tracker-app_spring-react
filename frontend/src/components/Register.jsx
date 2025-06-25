import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      toast.error("All fields are required");
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/auth/register', formData);
      toast.success("Registered successfully!");
      navigate("/login");
    } catch (err) {
        console.log(formData);
      console.error("Register error", err);
      toast.error("Registration failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-12 bg-white p-6 rounded shadow"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

      <input
        type="text"
        name="username"
        placeholder="Full Name"
        value={formData.username}
        onChange={handleChange}
        className="border w-full px-4 py-2 mb-3 rounded"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="border w-full px-4 py-2 mb-3 rounded"
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="border w-full px-4 py-2 mb-4 rounded"
        required
      />

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Register
      </button>
      <p className="text-sm text-center mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login here
        </Link>
      </p>

      <ToastContainer position="top-right" autoClose={2000} />
    </form>
  );
};

export default Register;
