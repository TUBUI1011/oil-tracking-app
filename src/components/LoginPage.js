import React, { useState } from "react"; // Import useState để quản lý trạng thái
import { Link } from "react-router-dom";
import "../assets/styles/login.css"; // Đảm bảo dòng này tồn tại

function LoginPage() {
  // --- LOGIC & STATE MANAGEMENT ---
  // State để lưu trữ giá trị của ô username và password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // State để quản lý việc ẩn/hiện mật khẩu
  const [showPassword, setShowPassword] = useState(false);

  // Hàm xử lý khi nhấn nút ẩn/hiện mật khẩu
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Đảo ngược giá trị hiện tại
  };

  // --- GIAO DIỆN (UI) ---
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
      <div className="form-container">
        {/* Username Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="username">
            Tên đăng nhập
          </label>
          <div className="input-wrapper">
            <span className="material-symbols-outlined input-icon">person</span>
            <input
              id="username"
              className="form-input"
              placeholder="Nhập tên đăng nhập"
              type="text"
              value={username} // Gán giá trị từ state
              onChange={(e) => setUsername(e.target.value)} // Cập nhật state khi người dùng nhập
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Mật khẩu
          </label>
          <div className="input-wrapper">
            <span className="material-symbols-outlined input-icon">lock</span>
            <input
              id="password"
              className="form-input"
              placeholder="Nhập mật khẩu"
              type={showPassword ? "text" : "password"} // Thay đổi type dựa trên state
              style={{ paddingRight: "3rem" }} // Chuyển style inline sang object
              value={password} // Gán giá trị từ state
              onChange={(e) => setPassword(e.target.value)} // Cập nhật state khi người dùng nhập
            />
            <button
              className="password-toggle"
              onClick={togglePasswordVisibility}
            >
              {/* Thay đổi icon dựa trên state */}
              <span className="material-symbols-outlined">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {/* Forgot Password Link */}
        <Link className="forgot-password" to="/forgot-password">
          Quên mật khẩu?
        </Link>

        {/* Login Button - Dùng Link để chuyển sang trang danh sách tank */}
        <Link to="/tanks" className="login-button">
          Đăng nhập
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
