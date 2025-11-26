import React, { useState, useMemo } from "react";
import { Link, NavLink } from "react-router-dom";
import "../assets/styles/listtankoil.css"; // Sử dụng file CSS đã được làm lại

// --- COMPONENT CON: TANK CARD (Giữ nguyên) ---
const TankCard = ({ tank, action, onMoveTank }) => {
  const isLow = tank.percentage < 30;
  return (
    <div className="tank-card">
      <Link to={`/tank/${tank.id}`} className="card-main-link">
        <div className="card-header">
          <span className="material-symbols-outlined tank-icon">oil_barrel</span>
          <div className="card-title-group">
            <p className="card-title">{tank.code}</p>
            <p className="card-subtitle">{tank.sscc}</p>
          </div>
        </div>
        <div className="card-body">
          <div className="percentage-bar-background">
            <div
              className={`percentage-bar-foreground ${isLow ? "low" : ""}`}
              style={{ width: `${tank.percentage}%` }}
            ></div>
          </div>
          <p className={`percentage-text ${isLow ? "low" : ""}`}>
            {tank.percentage}%
          </p>
        </div>
      </Link>
      {action && (
        <div className="card-footer">
          <button
            className="move-button"
            onClick={() => onMoveTank(tank.id, action.nextLocation, action.eventName)}
          >
            <span>{action.eventName}</span>
            <span className="material-symbols-outlined">{action.icon}</span>
          </button>
        </div>
      )}
    </div>
  );
};

// --- COMPONENT CON: ĐỔI TÊN THÀNH CỘT KANBAN ---
const KanbanColumn = ({ title, tanks, ...props }) => {
  return (
    <div className="kanban-column">
      <div className="kanban-column-header">
        <h2 className="kanban-column-title">{title}</h2>
        <span className="kanban-column-count">{tanks.length}</span>
      </div>
      <div className="kanban-column-body">
        {tanks.length > 0 ? (
          tanks.map((tank) => (
            <TankCard key={tank.id} tank={tank} {...props} />
          ))
        ) : (
          <p className="empty-text">Không có tank nào</p>
        )}
      </div>
    </div>
  );
};

// --- COMPONENT CHÍNH ---
function ListTankOilPage({ tanks, onMoveTank }) {
  const [searchTerm, setSearchTerm] = useState("");

  const tanksByLocation = useMemo(() => {
    const filtered = tanks.filter(
      (tank) =>
        (tank.code?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (tank.sscc?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );
    return {
      cont20: filtered.filter((t) => t.location === "Cont -20"),
      cont5: filtered.filter((t) => t.location === "Cont -5"),
      aroma: filtered.filter((t) => t.location === "Aroma Room"),
    };
  }, [tanks, searchTerm]);

  return (
    <div className="page-container kanban-layout">
      <header className="main-header">
        <h1 className="header-title">Theo dõi Tank Dầu</h1>
        <div className="search-bar-container">
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            className="search-input"
            placeholder="Tìm theo mã hoặc SSCC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* THAY ĐỔI MAIN CONTAINER THÀNH BẢNG KANBAN */}
      <main className="kanban-board">
        <KanbanColumn
          title="Cont -20°C (Trữ đông)"
          tanks={tanksByLocation.cont20}
          onMoveTank={onMoveTank}
          action={{ nextLocation: "Cont -5", eventName: "Chuyển kho", icon: "arrow_forward" }}
        />
        <KanbanColumn
          title="Cont -5°C (Rã đông)"
          tanks={tanksByLocation.cont5}
          onMoveTank={onMoveTank}
          action={{ nextLocation: "Aroma Room", eventName: "Lấy lên phòng", icon: "arrow_upward" }}
        />
        <KanbanColumn
          title="Aroma Room (Chờ trộn)"
          tanks={tanksByLocation.aroma}
          onMoveTank={onMoveTank}
          action={{ nextLocation: "Đã trộn", eventName: "Đưa vào trộn", icon: "blender" }}
        />
      </main>

      <Link to="/add-tank" className="fab-add-button">
        <span className="material-symbols-outlined">add</span>
      </Link>

      {/* Bottom Nav không còn cần thiết trên layout ngang, nhưng ta có thể ẩn nó đi trên màn hình lớn */}
      <nav className="bottom-nav">
        {/* Giữ nguyên code bottom-nav của bạn */}
      </nav>
    </div>
  );
}

export default ListTankOilPage;
