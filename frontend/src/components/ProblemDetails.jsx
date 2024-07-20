import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Editor from '@monaco-editor/react';

const ProblemDetails = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/problems/${id}`);
        setProblem(response.data);
      } catch (error) {
        console.error('Error fetching problem:', error);
      }
    };
    fetchProblem();
  }, [id]);

  const handleRun = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/submissions', {
        problem_id: id,
        language,
        code
      });
      const submissionId = response.data._id;
      // Here I will call the compiler API and update the submission with the result
      // For now, I'll just simulate it
      setOutput(`Submission created with ID: ${submissionId}`);
    } catch (error) {
      console.error('Error running code:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!problem) return <div>Loading...</div>;

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
              <a href="#" className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-blue-500 hover:text-white transition duration-300">Submissions</a>
              <button onClick={handleLogout} className="py-2 px-2 font-medium text-white bg-blue-500 rounded hover:bg-blue-400 transition duration-300">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto mt-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-semibold">{problem.title}</h2>
            <p className="mt-2">{problem.description}</p>
            <div className="mt-4">
              <h3 className="font-semibold">Sample Input</h3>
              <pre className="bg-gray-200 p-2 rounded">{problem.sample_input}</pre>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold">Sample Output</h3>
              <pre className="bg-gray-200 p-2 rounded">{problem.sample_output}</pre>
            </div>
          </div>
          <div className="lg:col-span-1 p-4 bg-white shadow rounded-lg">
            <Editor
              height="60vh"
              language={language}
              value={code}
              onChange={(value) => setCode(value)}
              options={{
                selectOnLineNumbers: true
              }}
            />
            <div className="mt-4">
              <label className="block mb-2">Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="border p-2 rounded">
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
              </select>
            </div>
            <button onClick={handleRun} className="mt-4 py-2 px-4 font-medium text-white bg-blue-500 rounded hover:bg-blue-400 transition duration-300">Run</button>
          </div>
          <div className="lg:col-span-1 p-4 bg-white shadow rounded-lg">
            <h3 className="text-xl font-semibold">Output</h3>
            <pre className="bg-gray-200 p-2 rounded">{output}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetails;
