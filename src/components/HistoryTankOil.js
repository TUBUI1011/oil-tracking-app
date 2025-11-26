import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../assets/styles/historyoil.css";

// --- HÀM HỖ TRỢ: NHÓM LỊCH SỬ THEO NGÀY ---
const groupHistoryByDate = (history) => {
  if (!history) return {};

  const groups = history.reduce((acc, entry) => {
    const date = new Date(entry.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateKey;
    if (date.toDateString() === today.toDateString()) {
      dateKey = `Hôm nay, ${date.toLocaleDateString("vi-VN")}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateKey = `Hôm qua, ${date.toLocaleDateString("vi-VN")}`;
    } else {
      dateKey = date.toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(entry);
    return acc;
  }, {});

  return groups;
};

// --- COMPONENT CHÍNH ---
function HistoryTankOilPage({ tanks }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // Tìm tank tương ứng từ props
  const tank = useMemo(
    () => tanks.find((t) => t.id === parseInt(id)),
    [tanks, id]
  );

  // Nhóm lịch sử của tank theo ngày
  const groupedHistory = useMemo(
    () => groupHistoryByDate(tank?.history),
    [tank]
  );

  if (!tank) {
    return (
      <div className="page-wrapper">
        <header className="history-header">
          <h1 className="header-title">Không tìm thấy Tank</h1>
        </header>
        <main>
          <p style={{ textAlign: "center", padding: "2rem" }}>
            Không tìm thấy thông tin cho tank này.
            <button onClick={() => navigate("/tanks")}>Quay lại</button>
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="page-wrapper history-page">
      <header className="history-header">
        <button className="header-button" onClick={() => navigate(-1)}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="header-title">Lịch sử: {tank.code}</h1>
        <div className="header-placeholder"></div>
      </header>

      <main>
        {/* Phần tìm kiếm và bộ lọc giữ nguyên cho phát triển sau này */}
        <div className="main-content">
          <div className="search-bar-wrapper">
            <span className="material-symbols-outlined search-icon">
              search
            </span>
            <input
              className="search-input"
              placeholder={`Tìm trong lịch sử của ${tank.code}...`}
              type="text"
            />
          </div>
        </div>

        <div className="transaction-list">
          {Object.entries(groupedHistory).map(([date, entries]) => (
            <div key={date} className="transaction-group">
              <h2 className="group-title">{date}</h2>
              {entries.map((entry, index) => (
                <div key={index} className="transaction-item">
                  <div
                    className={`item-icon-wrapper ${
                      entry.event === "Nhập kho" ? "in" : "out"
                    }`}
                  >
                    <span className="material-symbols-outlined">
                      {entry.event === "Nhập kho" && "add_circle"}
                      {entry.event === "Chuyển kho" && "move_up"}
                      {entry.event === "Lấy lên phòng" && "thermostat"}
                      {entry.event === "Đưa vào trộn" && "science"}
                    </span>
                  </div>
                  <div className="item-details">
                    <p className="item-title">{entry.event}</p>
                    <p className="item-subtitle">
                      {new Date(entry.timestamp).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      - Đến: {entry.location}
                    </p>
                  </div>
                  {/* Phần amount có thể thêm sau nếu có dữ liệu */}
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default HistoryTankOilPage;
