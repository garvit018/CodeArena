import React, { useState, useEffect } from "react";
import axios from "axios";
import Split from "react-split";
import { useParams, useNavigate } from "react-router-dom";
import ProblemDescription from "./ProblemDescription.jsx";
import CodeEditor from "./CodeEditor.jsx";

class Judge0API {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = "https://judge0-ce.p.rapidapi.com";
  }

  async createSubmission(languageId, sourceCode, stdin = "") {
    const url = `${this.baseUrl}/submissions?base64_encoded=true&wait=false&fields=*`;

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

        if (result.status.id > 2) {
          return result;
        }
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
    
    console.log("\n--- Execution Details ---");
    console.log("Time Used:", submission.time ? `${submission.time} seconds` : "N/A");
    console.log("Memory Used:", submission.memory ? `${submission.memory} KB` : "N/A");

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

  useEffect(() => {
    const fetchProblemDetails = async () => {
      try {
        const response = await axios.get(
          `https://codearena-653z.onrender.com/api/problems/${problemId}`,
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

  const handleExecute = async () => {
    if (!code.trim()) {
      alert("Please provide valid source code.");
      return;
    }

    setIsSubmitting(true);
    setOutput(null);

    try {
      const submissionResponse = await judge0.createSubmission(
        selectedLanguageId, 
        code
      );

      const submissionResult = await judge0.getSubmission(submissionResponse.token);
      
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

  const LanguageSelector = () => (
    <div className="mb-4">
      <label htmlFor="language" className="block text-white font-semibold mb-2">Select Language:</label>
      <select
        id="language"
        value={selectedLanguageId}
        onChange={(e) => setSelectedLanguageId(Number(e.target.value))}
        className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-gray-400"
      >
        {languages.map((lang) => (
          <option key={lang.id} value={lang.id} className="bg-gray-800 text-white">
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );

  const OutputPreview = () => {
    if (!output) return null;

    return (
      <div className="mt-6 p-4 bg-gray-900 border border-gray-700 rounded-lg">
        <h3 className="text-white font-bold text-lg mb-3">Output Preview</h3>
        <div className="mb-4">
          <p className="text-gray-300"><strong className="text-white">Status:</strong> {output.status}</p>
          <p className="text-gray-300"><strong className="text-white">Execution Time:</strong> {output.time}</p>
          <p className="text-gray-300"><strong className="text-white">Memory Used:</strong> {output.memory}</p>
        </div>
        {output.stdout && (
          <div className="mb-3">
            <h4 className="text-green-400 font-semibold mb-2">Standard Output:</h4>
            <pre className="bg-gray-800 text-green-300 p-3 rounded border border-gray-600 overflow-x-auto">{output.stdout}</pre>
          </div>
        )}
        {output.stderr && (
          <div className="mb-3">
            <h4 className="text-red-400 font-semibold mb-2">Standard Error:</h4>
            <pre className="bg-gray-800 text-red-300 p-3 rounded border border-gray-600 overflow-x-auto">{output.stderr}</pre>
          </div>
        )}
        {output.compileOutput && (
          <div className="mb-3">
            <h4 className="text-yellow-400 font-semibold mb-2">Compilation Output:</h4>
            <pre className="bg-gray-800 text-yellow-300 p-3 rounded border border-gray-600 overflow-x-auto">{output.compileOutput}</pre>
          </div>
        )}
      </div>
    );
  };

  const markProblemAsSolved = async () => {
    try {
      const response = await axios.patch(
        `https://codearena-653z.onrender.com/api/problems/${problemId}/solve`,
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
    <div className="h-screen bg-black flex flex-col">
      <Split className="flex-1" direction="horizontal" sizes={[50, 50]} gutterSize={10}>
        <div className="workspace-panel bg-gray-900 p-4 overflow-y-auto">
          <ProblemDescription details={details} />
        </div>
        <div className="workspace-panel bg-gray-900 p-4 flex flex-col">
          <LanguageSelector />
          <div className="flex-1 mb-4">
            <CodeEditor code={code} setCode={setCode} />
          </div>
          <div className="flex gap-4 mb-4">
            <button
              onClick={handleExecute}
              disabled={isSubmitting}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              {isSubmitting ? "Executing..." : "Execute Code"}
            </button>
            <button
              onClick={markProblemAsSolved}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              Submit
            </button>
          </div>
          <OutputPreview />
        </div>
      </Split>
    </div>
  );
}

export default Workspace;
