import React from "react";
// Sửa lại: Chỉ import những gì cần thiết cho layout
import { NavLink, Outlet, Link } from "react-router-dom";
import "../assets/styles/mainlayout.css";

function MainLayout() {
  return (
    <div className="app-container">
      <aside className="sidebar">{/* ... code của sidebar ... */}</aside>

      <div className="main-content-wrapper">
        {/* 
          Dòng <Outlet /> này sẽ tự động render component ListTankOilPage 
          (hoặc các page khác) mà App.js đã định nghĩa, 
          kèm theo đầy đủ các props như onUpdateAndMoveTank.
        */}
        <Outlet />
      </div>

      <Link to="/add-tank" className="fab-add-button">
        <span className="material-symbols-outlined">add</span>
      </Link>

      <nav className="bottom-nav">{/* ... code của bottom nav ... */}</nav>
    </div>
  );
}

export default MainLayout;
