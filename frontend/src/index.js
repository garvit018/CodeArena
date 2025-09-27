import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AuthProvider from "./context/authContext"; // Adjust the path as needed

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <AuthProvider>
      <App />
    </AuthProvider>
);
