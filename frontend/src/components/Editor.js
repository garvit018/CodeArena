import React, { useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/display/placeholder";
import "codemirror/addon/selection/active-line";
import "codemirror/addon/search/searchcursor";
import "codemirror/addon/dialog/dialog.css";
import "codemirror/addon/dialog/dialog";

import "../App.css";
import ACTIONS from "../Actions";

function Editor({ socketRef, roomId, onCodeChange }) {
  const editorRef = useRef(null);
  const codemirrorInstanceRef = useRef(null);

  useEffect(() => {
    // Initialize the editor
    const editor = Codemirror.fromTextArea(editorRef.current, {
      mode: { name: "javascript", json: true },
      theme: "dracula",
      autoCloseTags: true,
      autoCloseBrackets: true,
      lineNumbers: true,
      lineWrapping: true,
      matchBrackets: true,
      highlightSelectionMatches: true,
      showCursorWhenSelecting: true,
      styleActiveLine: true,
      placeholder: "Start typing your code here...",
    });

    editor.setSize("100%", "100%");
    codemirrorInstanceRef.current = editor;

    // Listen for changes in the editor and emit them
    editor.on("change", (instance, changes) => {
      const { origin } = changes;
      const code = instance.getValue();
      onCodeChange(code);
      console.log("Emitting code change:", code);
      if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
              roomId,
              code,
          });
      }
  });
  
    

    // Clean up on unmount
    return () => {
      editor.toTextArea();
    };
  }, [socketRef, roomId]);

  // Listen for code changes from the server and update the editor
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        console.log("Received code change:", code);
        if (codemirrorInstanceRef.current && code !== null && code !== undefined) {
          const currentCode = codemirrorInstanceRef.current.getValue();
          if (code !== currentCode) {
            codemirrorInstanceRef.current.setValue(code);
          }
        }
      });
    }
    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);
  

  
  return (
    <div className="editorWrapper">
      <textarea id="realTimeEditor" ref={editorRef}></textarea>
    </div>
  );
}

export default Editor;
