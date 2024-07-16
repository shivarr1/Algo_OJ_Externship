import React, { useState } from 'react';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      console.log('Login successful', data);
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome Back!</h2>
      <p className="text-gray-600 mb-6">Please sign in to your account</p>
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label htmlFor="email" className="block mb-1 font-medium text-gray-700">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label htmlFor="password" className="block mb-1 font-medium text-gray-700">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your password"
        />
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 font-semibold">
        Sign In
      </button>
    </form>
  );
};

export default Login;