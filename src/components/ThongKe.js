import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/thongke.css";

// --- DỮ LIỆU MẪU (SAU NÀY SẼ LẤY TỪ API) ---
const statsData = [
  { title: "Tổng lượng dầu", value: "15,230 L", span: 1 },
  { title: "Tiêu thụ trung bình", value: "350 L/ngày", span: 1 },
  { title: "Cảnh báo sắp hết", value: "2 tank", span: 2 },
];

const barChartData = [
  { label: "Tank 1", height: 75 },
  { label: "Tank 2", height: 40 },
  { label: "Tank 3", height: 90 },
  { label: "Tank 4", height: 20 },
];

const tankDetailsData = [
  {
    title: "Tank 1 - Diesel",
    subtitle: "Cập nhật: 2 phút trước",
    level: "3,800 / 5,000 L",
    status: "Ổn định",
  },
  {
    title: "Tank 2 - Diesel",
    subtitle: "Cập nhật: 5 phút trước",
    level: "1,950 / 5,000 L",
    status: "Sắp hết",
  },
  {
    title: "Tank 3 - Xăng 95",
    subtitle: "Cập nhật: 10 phút trước",
    level: "4,500 / 5,000 L",
    status: "Ổn định",
  },
  {
    title: "Tank 4 - Xăng 92",
    subtitle: "Cập nhật: 12 phút trước",
    level: "980 / 5,000 L",
    status: "Gần hết",
  },
];

// --- COMPONENT CHÍNH ---
function ThongKePage() {
  const navigate = useNavigate();

  const getStatusClassName = (status) => {
    if (status === "Ổn định") return "stable";
    if (status === "Sắp hết") return "low";
    if (status === "Gần hết") return "critical";
    return "";
  };

  return (
    <div className="page-wrapper">
      {/* Top App Bar */}
      <header className="report-header">
        <button className="header-button" onClick={() => navigate(-1)}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="header-title">Báo Cáo & Thống Kê</h1>
        <button className="header-button">
          <span className="material-symbols-outlined">download</span>
        </button>
      </header>

      {/* Chips / Filters */}
      <div className="filter-chips-container">
        <button className="filter-chip">
          <p>Tháng này</p>
          <span className="material-symbols-outlined">expand_more</span>
        </button>
        <button className="filter-chip">
          <p>Tất cả các tank</p>
          <span className="material-symbols-outlined">expand_more</span>
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className={`stat-card ${stat.span === 2 ? "full-span" : ""}`}
          >
            <p className="stat-card-title">{stat.title}</p>
            <p className="stat-card-value">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="content-section">
        <div className="chart-card">
          <p className="chart-card-title">Mức dầu hiện tại theo từng tank</p>
          <div className="chart-header">
            <p className="chart-value">15,230 L</p>
            <div className="chart-subtitle">
              <p className="chart-subtitle-text">Hôm nay</p>
              <p className="chart-percentage negative">-5%</p>
            </div>
          </div>
          <div className="bar-chart-grid">
            {barChartData.map((bar, index) => (
              <div key={index} className="bar-chart-item">
                <div
                  className="bar-chart-bar"
                  style={{ height: `${bar.height}%` }}
                ></div>
                <p className="bar-chart-label">{bar.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <p className="chart-card-title">Biến động mức dầu</p>
          <div className="chart-header">
            <p className="chart-value">TB: 4,120 L</p>
            <div className="chart-subtitle">
              <p className="chart-subtitle-text">Tháng này</p>
              <p className="chart-percentage positive">+2%</p>
            </div>
          </div>
          <div className="line-chart-container">
            <svg
              fill="none"
              height="148"
              preserveAspectRatio="none"
              viewBox="-3 0 478 150"
              width="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H326.769H0V109Z"
                fill="url(#paint0_linear_chart)"
              ></path>
              <path
                d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
                stroke="#f0d342"
                strokeLinecap="round"
                strokeWidth="3"
              ></path>
              <defs>
                <linearGradient
                  gradientUnits="userSpaceOnUse"
                  id="paint0_linear_chart"
                  x1="236"
                  x2="236"
                  y1="1"
                  y2="149"
                >
                  <stop stopColor="#f0d342" stopOpacity="0.3"></stop>
                  <stop offset="1" stopColor="#f0d342" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
            </svg>
            <div className="line-chart-labels">
              <p className="bar-chart-label">01/11</p>
              <p className="bar-chart-label">08/11</p>
              <p className="bar-chart-label">15/11</p>
              <p className="bar-chart-label">22/11</p>
              <p className="bar-chart-label">30/11</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tank Details List */}
      <h2 className="section-header">Chi tiết các tank</h2>
      <div className="tank-list">
        {tankDetailsData.map((tank, index) => (
          <div key={index} className="tank-item">
            <div className="tank-icon-wrapper">
              <span className="material-symbols-outlined">oil_barrel</span>
            </div>
            <div className="tank-details">
              <p className="tank-title">{tank.title}</p>
              <p className="tank-subtitle">{tank.subtitle}</p>
            </div>
            <div className="tank-status">
              <p className="tank-level">{tank.level}</p>
              <span
                className={`status-badge ${getStatusClassName(tank.status)}`}
              >
                {tank.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ThongKePage;
