import React, { useState, useEffect } from "react";
import axios from "axios";
import Split from "react-split";
import { useParams, useNavigate } from "react-router-dom";
import ProblemDescription from "./ProblemDescription";
import CodeEditor from "./CodeEditor";

class Judge0API {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = "https://judge0-ce.p.rapidapi.com";
  }

  async createSubmission(languageId, sourceCode, stdin = "") {
    const url = `${this.baseUrl}/submissions?base64_encoded=true&wait=false&fields=*`;

    // Use browser's btoa for Base64 encoding
    const base64SourceCode = btoa(unescape(encodeURIComponent(sourceCode)));
    const base64Stdin = btoa(unescape(encodeURIComponent(stdin)));

    const options = {
      method: "POST",
      url: url,
      headers: {
        "x-rapidapi-key": this.apiKey,
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      data: {
        language_id: languageId,
        source_code: base64SourceCode,
        stdin: base64Stdin,
      },
    };

    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error("Error creating submission:", error);
      throw error;
    }
  }

  async getSubmission(submissionToken, maxAttempts = 20) {
    const url = `${this.baseUrl}/submissions/${submissionToken}?base64_encoded=true&fields=*`;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await axios.get(url, {
          headers: {
            "x-rapidapi-key": this.apiKey,
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          },
        });

        const result = response.data;

        // Check if processing is complete
        if (result.status.id > 2) {
          return result;
        }

        // Wait before next attempt (increasing delay)
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
      }
    }

    throw new Error("Submission processing timed out");
  }

  decodeBase64(encodedStr) {
    try {
      return encodedStr 
        ? decodeURIComponent(escape(atob(encodedStr))) 
        : "";
    } catch (error) {
      console.error("Decoding error:", error);
      return "";
    }
  }

  processSubmissionResults(submission) {
    console.log("\n--- Detailed Submission Analysis ---");
    console.log("Status Code:", submission.status.id);
    console.log("Status Description:", submission.status.description);
    
    // Detailed output processing
    console.log("\n--- Execution Details ---");
    console.log("Time Used:", submission.time ? `${submission.time} seconds` : "N/A");
    console.log("Memory Used:", submission.memory ? `${submission.memory} KB` : "N/A");

    // Prepare output object
    const output = {
      status: submission.status.description,
      time: submission.time ? `${submission.time} seconds` : "N/A",
      memory: submission.memory ? `${submission.memory} KB` : "N/A",
      stdout: this.decodeBase64(submission.stdout),
      stderr: this.decodeBase64(submission.stderr),
      compileOutput: this.decodeBase64(submission.compile_output)
    };

    return output;
  }
}

function Workspace() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [output, setOutput] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguageId, setSelectedLanguageId] = useState(92); // Default to Python

  const token = localStorage.getItem("token");
  const JUDGE0_API_KEY = "8fd792c414msha5b799f22d55532p13345ejsnbc9d95444943";
  const judge0 = new Judge0API(JUDGE0_API_KEY);

  // Fetch problem details and languages
  useEffect(() => {
    const fetchProblemDetails = async () => {
      try {
        const response = await axios.get(
          `https://codearena-backend-ffqp.onrender.com/api/problems/${problemId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDetails(response.data);
      } catch (error) {
        setError("Error fetching problem details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchLanguages = async () => {
      try {
        const response = await axios.get(
          "https://judge0-ce.p.rapidapi.com/languages",
          {
            headers: {
              "x-rapidapi-key": JUDGE0_API_KEY,
              "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            },
          }
        );
        const filteredLanguages = response.data.filter((lang) =>
          ["C", "C++", "JavaScript", "Java", "Python", "Dart"].some((name) =>
            lang.name.includes(name)
          )
        );
        setLanguages(filteredLanguages);
        
        // Set default language if available
        const pythonLang = filteredLanguages.find(lang => lang.name.includes("Python"));
        if (pythonLang) {
          setSelectedLanguageId(pythonLang.id);
        }
      } catch (error) {
        console.error("Error fetching languages:", error);
        setError("Failed to load programming languages.");
      }
    };

    fetchProblemDetails();
    fetchLanguages();
  }, [problemId, token]);

  // Handle Code Execution
  const handleExecute = async () => {
    if (!code.trim()) {
      alert("Please provide valid source code.");
      return;
    }

    setIsSubmitting(true);
    setOutput(null);

    try {
      // Create submission
      const submissionResponse = await judge0.createSubmission(
        selectedLanguageId, 
        code
      );

      // Get submission result
      const submissionResult = await judge0.getSubmission(submissionResponse.token);
      
      // Process and set output
      const processedOutput = judge0.processSubmissionResults(submissionResult);
      setOutput(processedOutput);
    } catch (error) {
      console.error("Execution Error:", error);
      setOutput({
        status: "Error",
        stdout: "Failed to execute code",
        stderr: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Language Selector Component
  const LanguageSelector = () => (
    <div className="language-selector">
      <label htmlFor="language">Select Language:</label>
      <select
        id="language"
        value={selectedLanguageId}
        onChange={(e) => setSelectedLanguageId(Number(e.target.value))}
      >
        {languages.map((lang) => (
          <option key={lang.id} value={lang.id}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );

  // Output Preview Component
  const OutputPreview = () => {
    if (!output) return null;

    return (
      <div className="output-preview">
        <h3>Output Preview</h3>
        <div className="compile-status">
          <p><strong>Status:</strong> {output.status}</p>
          <p><strong>Execution Time:</strong> {output.time}</p>
          <p><strong>Memory Used:</strong> {output.memory}</p>
        </div>
        {output.stdout && (
          <div>
            <h4>Standard Output:</h4>
            <pre>{output.stdout}</pre>
          </div>
        )}
        {output.stderr && (
          <div className="error-output">
            <h4>Standard Error:</h4>
            <pre>{output.stderr}</pre>
          </div>
        )}
        {output.compileOutput && (
          <div className="compile-output">
            <h4>Compilation Output:</h4>
            <pre>{output.compileOutput}</pre>
          </div>
        )}
      </div>
    );
  };
  // Mark Problem as Solved
  const markProblemAsSolved = async () => {
    try {
      const response = await axios.patch(
        `https://codearena-backend-ffqp.onrender.com/api/problems/${problemId}/solve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert(
          `Problem marked as solved! Earned ${response.data.pointsAwarded} points.`
        );
        navigate("/problemtable");
      }
    } catch (error) {
      alert("Failed to mark the problem as solved.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;


  return (
    <Split className="split-horizontal" direction="horizontal" sizes={[50, 50]} gutterSize={10}>
      <div className="workspace-panel">
        <ProblemDescription details={details} />
      </div>
      <div className="workspace-panel">
        <LanguageSelector />
        <CodeEditor code={code} setCode={setCode} />
        <button 
          onClick={handleExecute} 
          disabled={isSubmitting}
          className="execute-button"
        >
          {isSubmitting ? "Executing..." : "Execute Code"}
        </button>
        <OutputPreview />
      <button onClick={markProblemAsSolved}>Submit</button>
      </div>
    </Split>
  );
}

export default Workspace;
