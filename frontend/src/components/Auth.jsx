import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex mb-4">
          <button 
            className={`flex-1 py-2 ${isLogin ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={`flex-1 py-2 ${!isLogin ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>
        {isLogin ? <Login /> : <Register />}
      </div>
    </div>
  );
};

export default Auth;