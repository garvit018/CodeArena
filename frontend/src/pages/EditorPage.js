import React, { useEffect, useRef, useState } from "react";
import Editor from "../components/Editor";
import "../App.css";
import { initSocket } from "../socket";
import { useLocation } from "react-router-dom";
import Client from "../components/Client";
import ACTIONS from "../Actions";
import toast from "react-hot-toast";
import logo from '../assest/logo.png';
import { Navigate, useNavigate, useParams } from "react-router-dom";
import CollaborativeEditor from "../components/Editor";
import axios from "axios";

// Judge0 API class (same as in Workspace component)
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

function EditorPage() {
  const location = useLocation();
  const socketRef = useRef(null);
  const reactNavigator = useNavigate();
  const codeRef = useRef(null);
  const { roomId } = useParams();
  const [clients, setClients] = useState([]);
  
  // Code Execution State
  const [languages, setLanguages] = useState([]);
  const [selectedLanguageId, setSelectedLanguageId] = useState(92); // Default to Python
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [output, setOutput] = useState(null);

  // Judge0 API setup
  const JUDGE0_API_KEY = "8fd792c414msha5b799f22d55532p13345ejsnbc9d95444943";
  const judge0 = new Judge0API(JUDGE0_API_KEY);

  // Fetch available languages on component mount
  useEffect(() => {
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
        toast.error("Failed to load programming languages.");
      }
    };

    fetchLanguages();
  }, []);

  // Handle Code Execution
  const handleExecute = async () => {
    if (!codeRef.current || !codeRef.current.trim()) {
      toast.error("Please provide valid source code.");
      return;
    }

    setIsSubmitting(true);
    setOutput(null);

    try {
      // Create submission
      const submissionResponse = await judge0.createSubmission(
        selectedLanguageId, 
        codeRef.current
      );

      // Get submission result
      const submissionResult = await judge0.getSubmission(submissionResponse.token);
      
      // Process and set output
      const processedOutput = judge0.processSubmissionResults(submissionResult);
      setOutput(processedOutput);
      
      // Show toast for different output scenarios
      if (processedOutput.status === "Accepted") {
        toast.success("Code executed successfully!");
      } else {
        toast.error(`Execution failed: ${processedOutput.status}`);
      }
    } catch (error) {
      console.error("Execution Error:", error);
      toast.error("Failed to execute code");
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

  const handleErrors = (e) => {
    console.log("socket error", e);
    toast.error("Socket connection failed, try again later");
    reactNavigator("/home");
  };

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });
      // listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(` ${username} has joined the room`);
            console.log(`${username} joined`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE,{
            code:codeRef.current,
            socketId,
          });
        }
      );
      //listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => {
          return prev.filter(
            (client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return ()=>{
       socketRef.current.disconnect();
       socketRef.current.off(ACTIONS.JOINED);
       socketRef.current.off(ACTIONS.DISCONNECTED);
    }
  }, []);

  async function copyRoomId(){
    try{
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied to clipboard");
    }catch(err){
      toast.error('could not copy Room Id');
      console.error();
    }
  };

  function leaveRoom(){
    reactNavigator('/home');
  }

  if (!location.state) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <h3>connected</h3>
          <div className="clientsList">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <button className="btn copyBtn" onClick={copyRoomId}>Copy ROOM ID</button>
        <button className="btn leaveBtn" onClick={leaveRoom}>Leave</button>
      </div>
      <div className="editorWrap">
       <div className="editor-head">
       <LanguageSelector />
        <div className="execution-controls">
          <button 
            onClick={handleExecute} 
            disabled={isSubmitting}
            className="execute-button"
          >
            {isSubmitting ? "Executing..." : "Execute Code"}
          </button>
        </div>
       </div>
        <CollaborativeEditor 
          socketRef={socketRef} 
          roomId={roomId} 
          onCodeChange={(code)=>{
            codeRef.current = code;
          }}
        />
       
        <OutputPreview />
      </div>
    </div>
  );
}

export default EditorPage;