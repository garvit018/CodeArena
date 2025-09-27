import React, { useState } from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ code, setCode }) => {
  const handleEditorChange = (newValue) => {
    setCode(newValue); // Directly update the code state in parent component
  };

  return (
    <div className="editor-container">
      <div className="code-editor-heading">Code Editor</div>
      <Editor
        height="80vh"
        width="100%"
        language="javascript"
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
