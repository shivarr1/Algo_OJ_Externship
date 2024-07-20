import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [form, setForm] = useState({ id: '', title: '', description: '', difficulty: '', tags: '', sample_input: '', sample_output: '', constraints: '' });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/problems');
        setProblems(response.data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    fetchProblems();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/problems/${editingId}`, form);
      } else {
        await axios.post('http://localhost:5000/api/problems', form);
      }
      setForm({ id: '', title: '', description: '', difficulty: '', tags: '', sample_input: '', sample_output: '', constraints: '' });
      setEditingId(null);
      const response = await axios.get('http://localhost:5000/api/problems');
      setProblems(response.data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (problem) => {
    setForm(problem);
    setEditingId(problem._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/problems/${id}`);
      const response = await axios.get('http://localhost:5000/api/problems');
      setProblems(response.data);
    } catch (error) {
      console.error('Error deleting problem:', error);
    }
  };

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
                <a href="#" className="flex items-center py-4 px-2">
                  <span className="font-semibold text-gray-500 text-lg">CODECANVAS</span>
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <a href="/problems" className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-blue-500 hover:text-white transition duration-300">Problems</a>
              <a href="#" className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-blue-500 hover:text-white transition duration-300">Submissions</a>
              <button onClick={handleLogout} className="py-2 px-2 font-medium text-white bg-blue-500 rounded hover:bg-blue-400 transition duration-300">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto mt-8 px-4">
        <h1 className="text-2xl font-semibold text-gray-800">Problems</h1>
        <form onSubmit={handleSubmit} className="mt-6 bg-white p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <input type="text" name="id" value={form.id} onChange={handleChange} placeholder="ID" className="border p-2 rounded" required />
            <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Title" className="border p-2 rounded" required />
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border p-2 rounded" required></textarea>
            <select name="difficulty" value={form.difficulty} onChange={handleChange} className="border p-2 rounded" required>
              <option value="">Select Difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <input type="text" name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="border p-2 rounded" required />
            <textarea name="sample_input" value={form.sample_input} onChange={handleChange} placeholder="Sample Input" className="border p-2 rounded" required></textarea>
            <textarea name="sample_output" value={form.sample_output} onChange={handleChange} placeholder="Sample Output" className="border p-2 rounded" required></textarea>
            <textarea name="constraints" value={form.constraints} onChange={handleChange} placeholder="Constraints" className="border p-2 rounded" required></textarea>
          </div>
          <button type="submit" className="mt-4 py-2 px-4 font-medium text-white bg-blue-500 rounded hover:bg-blue-400 transition duration-300">{editingId ? 'Update' : 'Create'} Problem</button>
        </form>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map(problem => (
            <div key={problem._id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <Link to={`/problems/${problem._id}`} className="text-xl font-semibold text-gray-800 hover:underline">{problem.title}</Link>
                <p className="text-gray-500">{problem.description}</p>
                <p className="mt-2">Difficulty: <span className="font-medium">{problem.difficulty}</span></p>
                <p className="mt-2">Tags: {problem.tags.join(', ')}</p>
                <pre className="mt-2 bg-gray-200 p-2 rounded">Sample Input: {problem.sample_input}</pre>
                <pre className="mt-2 bg-gray-200 p-2 rounded">Sample Output: {problem.sample_output}</pre>
                <p className="mt-2">Constraints: {problem.constraints}</p>
                <button onClick={() => handleEdit(problem)} className="mt-4 py-2 px-4 font-medium text-white bg-blue-500 rounded hover:bg-blue-400 transition duration-300">Edit</button>
                <button onClick={() => handleDelete(problem._id)} className="mt-4 ml-2 py-2 px-4 font-medium text-white bg-red-500 rounded hover:bg-red-400 transition duration-300">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Problems;
