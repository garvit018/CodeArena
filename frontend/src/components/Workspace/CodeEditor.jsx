import React from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ code, setCode }) => {
  const handleEditorChange = (newValue) => {
    setCode(newValue); // Directly update the code state in parent component
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-white font-bold text-lg mb-4">Code Editor</h2>
      <div className="flex-1 bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
        <Editor
          height="100%"
          width="100%"
          language="javascript"
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            automaticLayout: true,
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
