import React from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import "../assets/styles/mainlayout.css"; // Tạo file CSS mới cho layout

function MainLayout() {
  return (
    <div className="app-container">
      {/* --- THANH ĐIỀU HƯỚNG BÊN (SIDEBAR) CHO MÀN HÌNH LỚN --- */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="material-symbols-outlined logo-icon">
            oil_barrel
          </span>
          <h1 className="sidebar-title">Oil Tracker</h1>
        </div>
        <nav className="sidebar-nav">
          <NavLink
            to="/tanks"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span className="material-symbols-outlined">view_kanban</span>
            <span>Quy trình</span>
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span className="material-symbols-outlined">history</span>
            <span>Lịch sử đã trộn</span>
          </NavLink>
        </nav>
      </aside>

      {/* --- KHU VỰC HIỂN THỊ NỘI DUNG CHÍNH CỦA TỪNG TRANG --- */}
      <div className="main-content-wrapper">
        <Outlet />{" "}
        {/* Đây là nơi các trang con (ListTankOil, History...) sẽ được render */}
      </div>

      {/* --- NÚT THÊM MỚI (FAB) --- */}
      <Link to="/add-tank" className="fab-add-button">
        <span className="material-symbols-outlined">add</span>
      </Link>

      {/* --- THANH ĐIỀU HƯỚNG DƯỚI (BOTTOM BAR) CHO ĐIỆN THOẠI --- */}
      <nav className="bottom-nav">
        <NavLink
          to="/tanks"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <span className="material-symbols-outlined">view_kanban</span>
          <span>Quy trình</span>
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <span className="material-symbols-outlined">history</span>
          <span>Lịch sử</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default MainLayout;
