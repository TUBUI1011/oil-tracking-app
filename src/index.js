import React from "react";
import ReactDOM from "react-dom/client";
// SỬA LẠI: Thay đổi đường dẫn import từ './components/App' thành './App'
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
