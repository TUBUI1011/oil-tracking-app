import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "../assets/styles/mainlayout.css";
import ThongKePage from "./thongke"; // THÊM

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={`app-container${isSidebarOpen ? "" : " sidebar-collapsed"}`}
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
          <NavLink
            to="/audit-trail"
            className={({ isActive }) =>
              "nav-item" + (isActive ? " active" : "")
            }
          >
            <span className="material-symbols-outlined">manage_search</span>
            <span className="nav-text">Báo cáo</span>
          </NavLink>
          {/* THỐNG KÊ */}
          <NavLink
            to="/stats"
            className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
          >
            <span className="material-symbols-outlined">query_stats</span>
            <span>Thống kê</span>
          </NavLink>
        </nav>
      </aside>

      <main className="main-content-wrapper">
        {/* QUAN TRỌNG: chỉ Outlet, không bọc Routes ở đây */}
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
