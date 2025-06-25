import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    if (!email.trim()) return alert('Enter Credential');
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      toast.success('Login successful!');
      console.log("Saved token:", localStorage.getItem("token"));
      onLogin();
       navigate('/');
    } catch (err) {
         console.log('Login error:');
      toast.error('Invalid credentials');
    }
  };

  return (
    <form onSubmit={login} className="max-w-sm mx-auto mt-12 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border w-full px-4 py-2 mb-3 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border w-full px-4 py-2 mb-4 rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
          {/* 🔗 Register link */}
      <p className="text-sm text-center mt-4">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register here
        </Link>
      </p>
      <ToastContainer position="top-right" autoClose={2000} />

    </form>

    
  );
};

export default Login;
