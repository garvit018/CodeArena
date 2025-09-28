import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestCases = ({ problemId, code, languageId }) => {
  const [testCases, setTestCases] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const JUDGE0_API_KEY = "71dd2f88a9mshb19930106ac79bcp175f1ejsnc92887140ab7";

  // Fetch test cases for the specific problem
  useEffect(() => {
    const fetchProblemDetails = async () => {
      try {
        const response = await axios.get(
          `/api/problems/${problemId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        setTestCases(response.data.testCases);
      } catch (error) {
        setError("Failed to load test cases");
        console.error("Test cases fetch error:", error);
      }
    };

    fetchProblemDetails();
  }, [problemId, token]);

  // Run test cases
  const runTestCases = async () => {
    if (!code.trim()) {
      alert("Please provide valid source code.");
      return;
    }

    setIsRunning(true);
    setTestResults([]);
    setError(null);

    try {
      const results = await Promise.all(
        testCases.map(async (testCase) => {
          const submissionResponse = await createSubmission(
            languageId, 
            code, 
            testCase.input
          );

          const submissionResult = await getSubmission(submissionResponse.token);
          return processTestCaseResult(submissionResult, testCase);
        })
      );

      setTestResults(results);
    } catch (error) {
      setError("Error running test cases");
      console.error("Test cases execution error:", error);
    } finally {
      setIsRunning(false);
    }
  };

  // Create submission to Judge0
  const createSubmission = async (languageId, sourceCode, stdin) => {
    const url = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false&fields=*";
    
    const base64SourceCode = btoa(unescape(encodeURIComponent(sourceCode)));
    const base64Stdin = btoa(unescape(encodeURIComponent(stdin)));

    const options = {
      method: "POST",
      url: url,
      headers: {
        "x-rapidapi-key": JUDGE0_API_KEY,
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      data: {
        language_id: languageId,
        source_code: base64SourceCode,
        stdin: base64Stdin,
      },
    };

    const response = await axios.request(options);
    return response.data;
  };

  // Get submission status
  const getSubmission = async (submissionToken, maxAttempts = 20) => {
    const url = `https://judge0-ce.p.rapidapi.com/submissions/${submissionToken}?base64_encoded=true&fields=*`;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const response = await axios.get(url, {
        headers: {
          "x-rapidapi-key": JUDGE0_API_KEY,
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        },
      });

      const result = response.data;
      if (result.status.id > 2) {
        return result;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }

    throw new Error("Submission processing timed out");
  };

  // Process test case result
  const processTestCaseResult = (submission, testCase) => {
    const decodeBase64 = (encodedStr) => {
      try {
        return encodedStr 
          ? decodeURIComponent(escape(atob(encodedStr))) 
          : "";
      } catch (error) {
        console.error("Decoding error:", error);
        return "";
      }
    };

    const stdout = decodeBase64(submission.stdout).trim();
    const expectedOutput = testCase.output.trim();

    return {
      input: testCase.input,
      expectedOutput: expectedOutput,
      actualOutput: stdout,
      passed: stdout === expectedOutput,
      status: submission.status.description,
    };
  };

  // Render test case results
  const renderTestResults = () => {
    if (isRunning) return <div>Running test cases...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
      <div className="test-results">
        <h3>Test Case Results</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Input</th>
              <th className="border p-2">Expected Output</th>
              <th className="border p-2">Actual Output</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {testResults.map((result, index) => (
              <tr 
                key={index} 
                className={result.passed ? 'bg-green-100' : 'bg-red-100'}
              >
                <td className="border p-2">{result.input}</td>
                <td className="border p-2">{result.expectedOutput}</td>
                <td className="border p-2">{result.actualOutput}</td>
                <td className="border p-2">
                  {result.passed ? '✓ Passed' : '✗ Failed'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="test-cases-container">
      <button 
        onClick={runTestCases} 
        disabled={isRunning || testCases.length === 0}
        className="run-test-cases-button"
      >
        {isRunning ? 'Running Tests...' : 'Run Test Cases'}
      </button>
      {renderTestResults()}
    </div>
  );
};

export default TestCases;