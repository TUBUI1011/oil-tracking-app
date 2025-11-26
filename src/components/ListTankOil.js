import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom"; // NavLink tốt hơn cho thanh điều hướng
import "../assets/styles/listtankoil.css";

// --- DỮ LIỆU MẪU (SAU NÀY SẼ LẤY TỪ API) ---
const tanksData = [
  {
    id: 1,
    code: "OIL-A-123",
    sscc: "(00) 1 234567 890123 456 7",
    percentage: 85,
    liters: 850,
    capacity: 1000,
  },
  {
    id: 2,
    code: "OIL-B-456",
    sscc: "(00) 9 876543 210987 654 3",
    percentage: 60,
    liters: 600,
    capacity: 1000,
  },
  {
    id: 3,
    code: "OIL-C-789",
    sscc: "(00) 5 554321 987654 321 0",
    percentage: 25,
    liters: 250,
    capacity: 1000,
  },
  {
    id: 4,
    code: "OIL-D-101",
    sscc: "(00) 3 141592 653589 793 2",
    percentage: 95,
    liters: 1900,
    capacity: 2000,
  },
];

const filterOptions = ["Tất cả", "Mức dầu cao", "Mức dầu thấp"];

// --- COMPONENT CHÍNH ---
function TankListPage() {
  // --- STATE MANAGEMENT ---
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tất cả");

  // --- LOGIC LỌC DỮ LIỆU ---
  const filteredTanks = tanksData.filter((tank) => {
    // Lọc theo ô tìm kiếm
    const matchesSearch =
      tank.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tank.sscc.toLowerCase().includes(searchTerm.toLowerCase());

    // Lọc theo chip đang active
    const matchesFilter = () => {
      if (activeFilter === "Mức dầu cao") return tank.percentage >= 70;
      if (activeFilter === "Mức dầu thấp") return tank.percentage < 30;
      return true; // 'Tất cả'
    };

    return matchesSearch && matchesFilter();
  });

  // --- GIAO DIỆN (UI) ---
  return (
    <div className="page-container">
      {/* Top App Bar */}
      <header className="main-header">
        <h1 className="header-title">Danh sách Tank Dầu</h1>
        <div className="header-placeholder"></div>
      </header>

      {/* Search and Filter */}
      <div className="search-filter-bar">
        <div className="search-input-wrapper">
          <div className="search-icon">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input
            className="search-input"
            placeholder="Tìm theo Material Code, SSCC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="filter-button">
          <span className="material-symbols-outlined">filter_list</span>
        </button>
      </div>

      {/* Chips for quick filtering */}
      <div className="filter-chips-container">
        {filterOptions.map((option) => (
          <button
            key={option}
            className={`filter-chip ${
              activeFilter === option ? "active" : "inactive"
            }`}
            onClick={() => setActiveFilter(option)}
          >
            <p>{option}</p>
          </button>
        ))}
      </div>

      {/* Main Content: Tank List */}
      <main className="tank-list-container">
        {filteredTanks.map((tank) => (
          <Link
            to={`/tank/${tank.id}`}
            key={tank.id}
            className="tank-item"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="tank-icon-wrapper">
              <span className="material-symbols-outlined">oil_barrel</span>
              <div
                className={`tank-level-indicator ${
                  tank.percentage < 30 ? "low" : ""
                }`}
                style={{ height: `${tank.percentage}%` }}
              ></div>
            </div>
            <div className="tank-details">
              <p className="tank-title">{tank.code}</p>
              <p className="tank-subtitle">SSCC: {tank.sscc}</p>
            </div>
            <div className="tank-percentage">
              <p
                className={`percentage-value ${
                  tank.percentage < 30 ? "low" : ""
                }`}
              >
                {tank.percentage}%
              </p>
              <p className="percentage-liters">
                {tank.liters}/{tank.capacity}L
              </p>
            </div>
            <div className="chevron-icon">
              <span className="material-symbols-outlined">chevron_right</span>
            </div>
          </Link>
        ))}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <NavLink
          to="/tanks"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : "inactive"}`
          }
        >
          <span className="material-symbols-outlined icon-fill">
            oil_barrel
          </span>
          <span className="nav-label">Tank Dầu</span>
        </NavLink>
        <NavLink
          to="/usage"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : "inactive"}`
          }
        >
          <span className="material-symbols-outlined">science</span>
          <span className="nav-label">Sử dụng</span>
        </NavLink>
        <NavLink
          to="/info"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : "inactive"}`
          }
        >
          <span className="material-symbols-outlined">info</span>
          <span className="nav-label">Thông tin</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default TankListPage;
