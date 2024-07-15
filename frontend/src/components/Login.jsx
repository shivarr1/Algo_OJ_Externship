import React, { useState } from 'react';
import { login } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      console.log('Login successful', data);
      // Here you would typically save the token and redirect the user
    } catch (error) {
      setError(error.message);
    }
  };

};

export default Login;