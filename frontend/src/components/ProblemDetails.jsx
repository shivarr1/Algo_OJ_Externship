import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProblemById } from '../services/problemService';
import CodeEditor from '@uiw/react-textarea-code-editor';

const ProblemDetail = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const data = await getProblemById(id);
        setProblem(data);
      } catch (error) {
        console.error('Error fetching problem:', error);
      }
    };

    fetchProblem();
  }, [id]);

  const handleRun = async () => {
    // Logic to send code, input to the backend, and get the output, will do it later.
  };
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };


  if (!problem) {
    return <div>Loading...</div>;
  }

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
        <h1 className="text-2xl font-semibold text-gray-800">{problem.title}</h1>
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700">Description</h2>
          <p className="mt-2 text-gray-700">{problem.description}</p>
          <h2 className="text-xl font-semibold text-gray-700 mt-4">Constraints</h2>
          <p className="mt-2 text-gray-700">{problem.constraints}</p>
          <h2 className="text-xl font-semibold text-gray-700 mt-4">Sample Input</h2>
          <pre className="mt-2 bg-gray-200 p-2">{problem.sample_input}</pre>
          <h2 className="text-xl font-semibold text-gray-700 mt-4">Sample Output</h2>
          <pre className="mt-2 bg-gray-200 p-2">{problem.sample_output}</pre>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-700">Code Here</h2>
          <CodeEditor
            value={code}
            language="js"
            placeholder="Please enter your code."
            onChange={(evn) => setCode(evn.target.value)}
            padding={15}
            style={{
              fontSize: 12,
              backgroundColor: "#f5f5f5",
              fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono, Menlo, monospace',
            }}
          />
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-700">Input</h2>
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            rows="5"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></textarea>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-700">Output</h2>
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            rows="5"
            value={output}
            readOnly
          ></textarea>
        </div>

        <button onClick={handleRun} className="mt-4 py-2 px-4 font-medium text-white bg-blue-500 rounded hover:bg-blue-400 transition duration-300">Run</button>
      </div>
    </div>
  );
};

export default ProblemDetail;
