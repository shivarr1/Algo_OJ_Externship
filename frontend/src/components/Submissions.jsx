import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/submissions', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setSubmissions(response.data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };

    fetchSubmissions();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between">
            <div className="flex space-x-7">
              <div>
                <a href="/" className="flex items-center py-4 px-2">
                  <span className="font-semibold text-gray-500 text-lg">CODECANVAS</span>
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <a href="/problems" className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-blue-500 hover:text-white transition duration-300">Problems</a>
              <a href="/submissions" className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-blue-500 hover:text-white transition duration-300">Submissions</a>
              <button onClick={handleLogout} className="py-2 px-2 font-medium text-white bg-blue-500 rounded hover:bg-blue-400 transition duration-300">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto mt-8 px-4">
        <h1 className="text-2xl font-semibold text-gray-800">Submissions</h1>
        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problem ID</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verdict</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map(submission => (
                <tr key={submission._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{submission.user_id.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{submission.problem_id.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><pre>{submission.code}</pre></td>
                  <td className="px-6 py-4 whitespace-nowrap">{submission.verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Submissions;
