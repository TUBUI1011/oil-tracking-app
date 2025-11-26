import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/login.css";

function LoginPage() {
  // --- LOGIC & STATE MANAGEMENT ---
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault(); // Ngăn form submit và tải lại trang
    // Logic đăng nhập sẽ ở đây
    // Ví dụ: điều hướng đến trang danh sách tank
    navigate("/tanks");
  };

  // --- RENDER ---
  return (
    <div className="login-container">
      {/* Logo */}
      <div className="login-logo">
        <span className="material-symbols-outlined">oil_barrel</span>
      </div>

      {/* Headline & Body Text */}
      <h1 className="login-title">Chào mừng trở lại</h1>
      <p className="login-subtitle">Đăng nhập vào tài khoản của bạn</p>

      {/* Form container */}
      <form className="form-container" onSubmit={handleLogin}>
        {/* --- Ô Tên đăng nhập --- */}
        <div className="form-group">
          <label className="form-label" htmlFor="username">
            Tên đăng nhập
          </label>
          {/* SỬA LẠI CẤU TRÚC Ở ĐÂY */}
          <div className="input-wrapper">
            <span className="material-symbols-outlined input-icon">person</span>
            <input
              id="username"
              className="form-input"
              type="text"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Cập nhật state khi người dùng nhập
              required
            />
          </div>
        </div>

        {/* --- Ô Mật khẩu --- */}
        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Mật khẩu
          </label>
          {/* SỬA LẠI CẤU TRÚC Ở ĐÂY */}
          <div className="input-wrapper">
            <span className="material-symbols-outlined input-icon">lock</span>
            <input
              id="password"
              className="form-input"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              <span className="material-symbols-outlined">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
          <a href="#" className="forgot-password">
            Quên mật khẩu?
          </a>
        </div>

        <button type="submit" className="login-button">
          Đăng nhập
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
