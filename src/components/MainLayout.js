import React, { useState } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import "../assets/styles/mainlayout.css";

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={`app-container ${!isSidebarOpen ? "sidebar-collapsed" : ""}`}
    >
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-group">
            <span className="material-symbols-outlined logo-icon">
              oil_barrel
            </span>
            <h1 className="sidebar-title">Oil Tracker</h1>
          </div>
        </div>
        <nav className="sidebar-nav">
          <NavLink
            to="/tanks"
            className={({ isActive }) =>
              "nav-item" + (isActive ? " active" : "")
            }
          >
            <span className="material-symbols-outlined">view_kanban</span>
            <span className="nav-text">Quy trình</span>
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              "nav-item" + (isActive ? " active" : "")
            }
          >
            <span className="material-symbols-outlined">history</span>
            <span className="nav-text">Lịch sử đã trộn</span>
          </NavLink>
        </nav>
      </aside>

      {/* NÚT TOGGLE ĐƯỢC ĐẶT NGANG HÀNG */}
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        <span className="material-symbols-outlined">chevron_left</span>
      </button>

      <div className="main-content-wrapper">
        <Outlet />
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
          <span className="nav-text">Lịch sử</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default MainLayout;
