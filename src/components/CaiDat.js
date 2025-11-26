// 1. IMPORT CÁC THƯ VIỆN CẦN THIẾT
import React from 'react';
import { Link } from 'react-router-dom'; // Dùng <Link> thay cho <a> để điều hướng

// 2. IMPORT FILE CSS TƯƠNG ỨNG
import '../assets/styles/caidat.css';

// 3. ĐỊNH NGHĨA COMPONENT (Tên viết hoa chữ cái đầu)
function CaiDatPage() {
  // Trả về mã JSX (HTML đã được chuyển đổi)
  return (
    <div className="page-wrapper">
      <header className="settings-header">
        <button className="header-button">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="header-title">Cài Đặt</h1>
        <div className="header-placeholder"></div>
      </header>

      <div className="profile-section">
        <div className="avatar-container">
          {/* Thẻ <img> cần có dấu / ở cuối */}
          <img alt="User Avatar" className="avatar-image" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiBrQnKs4oTEgxR2dQ7DotRHKH-B3O0x9x2Dui4BucsGeERjvb1xaZW7qj-tS3QMIh8A12bom9HrXW_-DxkOKMoEeyFOO9k-STmEdxJy-wpFFJqjt6sBDaM8nWv2U_8uf7PrcdNFhmfKcGE7OAZzjPL1Y_e3j6gljKzfM-r3x21jQdiSjqCpmjeBMqGvrhpRyc7YEyHYBe6W1mTOFu902hHkTB2N34cP-YLLcOuksG6oBGSeiTwaCUC9lQNV7qCKc5_bAZ6GP3PeU" />
          <button className="avatar-edit-button">
            <span className="material-symbols-outlined">edit</span>
          </button>
        </div>
        <div className="profile-info">
          <p className="profile-name">Nguyễn Văn An</p>
          <p className="profile-email">nv.an@example.com</p>
        </div>
      </div>

      <div className="settings-list-section">
        <div className="settings-group">
          <p className="group-title">Tài khoản</p>
          <div className="group-container">
            {/* Thẻ <a> được thay bằng <Link> với đường dẫn cụ thể */}
            <Link className="settings-item" to="/settings/profile">
              <span className="material-symbols-outlined item-icon">person</span>
              <span className="item-label">Chỉnh sửa thông tin</span>
              <span className="material-symbols-outlined item-chevron">chevron_right</span>
            </Link>
            {/* Thẻ <hr> cần có dấu / ở cuối */}
            <hr className="item-divider" />
            <Link className="settings-item" to="/settings/password">
              <span className="material-symbols-outlined item-icon">lock</span>
              <span className="item-label">Thay đổi mật khẩu</span>
              <span className="material-symbols-outlined item-chevron">chevron_right</span>
            </Link>
          </div>
        </div>
        <div className="settings-group">
          <p className="group-title">Ứng dụng</p>
          <div className="group-container">
            <Link className="settings-item" to="/settings/notifications">
              <span className="material-symbols-outlined item-icon">notifications</span>
              <span className="item-label">Quản lý thông báo</span>
              <span className="material-symbols-outlined item-chevron">chevron_right</span>
            </Link>
            <hr className="item-divider" />
            <Link className="settings-item" to="/settings/app">
              <span className="material-symbols-outlined item-icon">tune</span>
              <span className="item-label">Cài đặt ứng dụng</span>
              <span className="material-symbols-outlined item-chevron">chevron_right</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="logout-section">
        <button className="logout-button">
          <span className="material-symbols-outlined">logout</span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}

// 4. EXPORT COMPONENT ĐỂ SỬ DỤNG Ở NƠI KHÁC
export default CaiDatPage;