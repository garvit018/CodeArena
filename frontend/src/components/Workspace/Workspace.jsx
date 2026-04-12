import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ProblemDescription from "./ProblemDescription.jsx";
import CodeEditor from "./CodeEditor.jsx";
import httpClient, { getAuthHeaders } from "../../services/httpClient.jsx";

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
      return encodedStr ? decodeURIComponent(escape(atob(encodedStr))) : "";
    } catch (error) {
      console.error("Decoding error:", error);
      return "";
    }
  }

  processSubmissionResults(submission) {
    const output = {
      status: submission.status.description,
      time: submission.time ? `${submission.time} seconds` : "N/A",
      memory: submission.memory ? `${submission.memory} KB` : "N/A",
      stdout: this.decodeBase64(submission.stdout),
      stderr: this.decodeBase64(submission.stderr),
      compileOutput: this.decodeBase64(submission.compile_output),
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

  const JUDGE0_API_KEY = process.env.REACT_APP_JUDGE0_API_KEY || "";
  const judge0 = new Judge0API(JUDGE0_API_KEY);

  const normalizeOutput = (value) =>
    String(value || "")
      .replace(/\r\n/g, "\n")
      .trim();

  const parseExamplesToTestCases = (rawExamples = []) => {
    const parsed = [];
    let pendingInput = "";

    for (const raw of rawExamples) {
      const text = String(raw || "").trim();
      if (!text) continue;

      const inputMatch = text.match(
        /Input:\s*(.*?)(?=\s*Output:|\s*Explanation:|$)/i,
      );
      const outputMatch = text.match(/Output:\s*(.*?)(?=\s*Explanation:|$)/i);

      const input = inputMatch ? inputMatch[1].trim() : "";
      const output = outputMatch ? outputMatch[1].trim() : "";

      if (input && output) {
        parsed.push({ input, output });
        pendingInput = "";
        continue;
      }

      if (input && !output) {
        pendingInput = input;
        continue;
      }

      if (!input && output && pendingInput) {
        parsed.push({ input: pendingInput, output });
        pendingInput = "";
      }
    }

    return parsed;
  };

  const runTestCaseValidation = async () => {
    const backendTestCases = details?.testCases || [];
    const exampleFallbackCases = parseExamplesToTestCases(
      details?.examples || [],
    );
    const testCases = backendTestCases.length
      ? backendTestCases
      : exampleFallbackCases;

    if (!testCases.length) {
      return {
        ok: Boolean(
          output?.status === "Accepted" &&
          !output?.stderr &&
          !output?.compileOutput,
        ),
        message: "No structured test cases found; using execution result.",
        testCaseResults: [],
      };
    }

    const testCaseResults = [];

    for (let index = 0; index < testCases.length; index += 1) {
      const testCase = testCases[index];
      const submissionResponse = await judge0.createSubmission(
        selectedLanguageId,
        code,
        testCase.input || "",
      );

      const submissionResult = await judge0.getSubmission(
        submissionResponse.token,
      );
      const processed = judge0.processSubmissionResults(submissionResult);

      const actual = normalizeOutput(processed.stdout);
      const expected = normalizeOutput(testCase.output);

      const caseResult = {
        index: index + 1,
        input: testCase.input || "",
        expected,
        actual,
        status: processed.status,
        passed: false,
        error: "",
      };

      if (processed.stderr || processed.compileOutput) {
        caseResult.error = processed.stderr || processed.compileOutput;
        testCaseResults.push(caseResult);
        return {
          ok: false,
          message: `Test case ${index + 1} failed with runtime/compile error.`,
          stderr: processed.stderr || processed.compileOutput,
          testCaseResults,
        };
      }

      caseResult.passed = actual === expected;
      testCaseResults.push(caseResult);
      if (actual !== expected) {
        return {
          ok: false,
          message: `Wrong answer on test case ${index + 1}.`,
          stderr: `Expected: ${expected}\nReceived: ${actual}`,
          testCaseResults,
        };
      }
    }

    return { ok: true, message: "All test cases passed.", testCaseResults };
  };

  useEffect(() => {
    const fetchProblemDetails = async () => {
      try {
        const response = await httpClient.get(`/api/problems/${problemId}`, {
          headers: getAuthHeaders(),
        });
        setDetails(response.data);
      } catch (error) {
        setError("Error fetching problem details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchLanguages = async () => {
      if (!JUDGE0_API_KEY) {
        setError("Judge0 API key is not configured.");
        return;
      }

      try {
        const response = await axios.get(
          "https://judge0-ce.p.rapidapi.com/languages",
          {
            headers: {
              "x-rapidapi-key": JUDGE0_API_KEY,
              "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            },
          },
        );
        const filteredLanguages = response.data.filter((lang) =>
          ["C", "C++", "JavaScript", "Java", "Python", "Dart"].some((name) =>
            lang.name.includes(name),
          ),
        );
        setLanguages(filteredLanguages);

        const pythonLang = filteredLanguages.find((lang) =>
          lang.name.includes("Python"),
        );
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
  }, [problemId, JUDGE0_API_KEY]);

  const handleExecute = async () => {
    if (!code.trim()) {
      setOutput({
        status: "Error",
        stdout: "",
        stderr: "Please provide valid source code.",
      });
      return;
    }

    if (!JUDGE0_API_KEY) {
      setOutput({
        status: "Error",
        stdout: "",
        stderr: "Judge0 API key is not configured.",
      });
      return;
    }

    setIsSubmitting(true);
    setOutput(null);

    try {
      const submissionResponse = await judge0.createSubmission(
        selectedLanguageId,
        code,
      );

      const submissionResult = await judge0.getSubmission(
        submissionResponse.token,
      );

      const processedOutput = judge0.processSubmissionResults(submissionResult);
      setOutput(processedOutput);
    } catch (error) {
      console.error("Execution Error:", error);
      setOutput({
        status: "Error",
        stdout: "Failed to execute code",
        stderr: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const LanguageSelector = () => (
    <div className="mb-4">
      <label htmlFor="language" className="block text-white font-semibold mb-2">
        Select Language:
      </label>
      <select
        id="language"
        value={selectedLanguageId}
        onChange={(e) => setSelectedLanguageId(Number(e.target.value))}
        className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-gray-400"
      >
        {languages.map((lang) => (
          <option
            key={lang.id}
            value={lang.id}
            className="bg-gray-800 text-white"
          >
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
          <p className="text-gray-300">
            <strong className="text-white">Status:</strong> {output.status}
          </p>
          <p className="text-gray-300">
            <strong className="text-white">Execution Time:</strong>{" "}
            {output.time}
          </p>
          <p className="text-gray-300">
            <strong className="text-white">Memory Used:</strong> {output.memory}
          </p>
        </div>
        {output.stdout && (
          <div className="mb-3">
            <h4 className="text-green-400 font-semibold mb-2">
              Standard Output:
            </h4>
            <pre className="bg-gray-800 text-green-300 p-3 rounded border border-gray-600 overflow-x-auto">
              {output.stdout}
            </pre>
          </div>
        )}
        {output.stderr && (
          <div className="mb-3">
            <h4 className="text-red-400 font-semibold mb-2">Standard Error:</h4>
            <pre className="bg-gray-800 text-red-300 p-3 rounded border border-gray-600 overflow-x-auto">
              {output.stderr}
            </pre>
          </div>
        )}
        {output.compileOutput && (
          <div className="mb-3">
            <h4 className="text-yellow-400 font-semibold mb-2">
              Compilation Output:
            </h4>
            <pre className="bg-gray-800 text-yellow-300 p-3 rounded border border-gray-600 overflow-x-auto">
              {output.compileOutput}
            </pre>
          </div>
        )}
        {Array.isArray(output.testCaseResults) &&
          output.testCaseResults.length > 0 && (
            <div className="mb-3">
              <h4 className="text-cyan-300 font-semibold mb-2">
                Test Case Details:
              </h4>
              <div className="space-y-3">
                {output.testCaseResults.map((tc) => (
                  <div
                    key={tc.index}
                    className="bg-gray-800 p-3 rounded border border-gray-600"
                  >
                    <p className="text-gray-200 font-semibold mb-1">
                      Case {tc.index}: {tc.passed ? "Passed" : "Failed"}
                    </p>
                    <p className="text-gray-300 text-sm whitespace-pre-wrap break-words">
                      <strong>Input:</strong> {tc.input || "(empty)"}
                    </p>
                    <p className="text-gray-300 text-sm whitespace-pre-wrap break-words">
                      <strong>Expected Output:</strong>{" "}
                      {tc.expected || "(empty)"}
                    </p>
                    <p className="text-gray-300 text-sm whitespace-pre-wrap break-words">
                      <strong>Your Output:</strong> {tc.actual || "(empty)"}
                    </p>
                    {tc.error && (
                      <p className="text-red-300 text-sm whitespace-pre-wrap break-words">
                        <strong>Error:</strong> {tc.error}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    );
  };

  const markProblemAsSolved = async () => {
    if (!code.trim()) {
      setOutput({
        status: "Error",
        stdout: "",
        stderr: "Please provide valid source code before submitting.",
      });
      return;
    }

    if (!JUDGE0_API_KEY) {
      setOutput({
        status: "Error",
        stdout: "",
        stderr: "Judge0 API key is not configured.",
      });
      return;
    }

    setIsSubmitting(true);
    let validationResult = null;

    try {
      validationResult = await runTestCaseValidation();
      if (!validationResult.ok) {
        setOutput({
          status: "Wrong Answer",
          stdout: "",
          stderr: validationResult.stderr || validationResult.message,
          testCaseResults: validationResult.testCaseResults || [],
        });
        return;
      }

      const response = await httpClient.patch(
        `/api/problems/${problemId}/solve`,
        {},
        { headers: getAuthHeaders() },
      );

      if (response.data.success) {
        setOutput((prev) => ({
          ...prev,
          status: "Accepted",
          stdout: `Problem marked as solved! Earned ${response.data.pointsAwarded} points.`,
          stderr: "",
          testCaseResults: validationResult.testCaseResults || [],
        }));
        navigate("/problemtable");
      }
    } catch (error) {
      if (error.response?.data?.message === "Problem already solved") {
        setOutput((prev) => ({
          ...prev,
          status: "Accepted",
          stdout: "You have already solved this problem.",
          stderr: "",
          testCaseResults: validationResult?.testCaseResults || [],
        }));
        return;
      }

      setOutput({
        status: "Error",
        stdout: "",
        stderr:
          error.response?.data?.message ||
          "Failed to mark the problem as solved.",
        testCaseResults: [],
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="h-screen bg-black flex flex-col">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2">
        <div className="workspace-panel bg-gray-900 p-4 overflow-y-auto">
          <ProblemDescription details={details} />
        </div>
        <div className="workspace-panel bg-gray-900 p-4 flex flex-col min-h-0">
          <LanguageSelector />
          <div className="flex-1 mb-4 min-h-[380px]">
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
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
          <OutputPreview />
        </div>
      </div>
    </div>
  );
}

export default Workspace;
