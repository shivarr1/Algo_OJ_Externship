import React, { useState } from 'react';
import { register } from '../services/api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    try {
      const data = await register(username, email, password);
      console.log('Registration successful', data);
      // Here you would typically redirect the user to the login page
    } catch (error) {
      setError(error.message);
    }
  };

};

export default Register;