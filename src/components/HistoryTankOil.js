import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../assets/styles/historyoil.css";

// --- DỮ LIỆU MẪU (SAU NÀY SẼ LẤY TỪ API) ---
// Dữ liệu được nhóm theo ngày để dễ dàng render
const historyData = {
  "Hôm nay, 26/11/2025": [
    {
      id: 1,
      type: "out",
      title: "OIL-LUB-XYZ",
      subtitle: "14:30 - SSCC: ...45678",
      amount: -50,
      remaining: 1450,
    },
    {
      id: 2,
      type: "out",
      title: "OIL-LUB-XYZ",
      subtitle: "09:15 - SSCC: ...45678",
      amount: -100,
      remaining: 1500,
    },
  ],
  "Hôm qua, 25/11/2025": [
    {
      id: 3,
      type: "out",
      title: "OIL-GEN-ABC",
      subtitle: "16:45 - SSCC: ...98765",
      amount: -25,
      remaining: 875,
    },
    {
      id: 4,
      type: "in",
      title: "Nhập kho",
      subtitle: "08:00 - OIL-LUB-XYZ",
      amount: 2000,
      remaining: "Tank mới",
    },
  ],
  "Ngày 23/11/2025": [
    {
      id: 5,
      type: "out",
      title: "OIL-LUB-XYZ",
      subtitle: "11:05 - SSCC: ...45678",
      amount: -75,
      remaining: 1600,
    },
  ],
};

// --- COMPONENT CHÍNH ---
function HistoryTankOilPage() {
  const { id } = useParams(); // Lấy id của tank từ URL để sau này lọc API
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      <header className="history-header">
        <button className="header-button" onClick={() => navigate(-1)}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="header-title">Lịch Sử Tank Oil</h1>
        <div className="header-placeholder"></div>
      </header>

      <main>
        <div className="main-content">
          <div className="search-bar-wrapper">
            <span className="material-symbols-outlined search-icon">
              search
            </span>
            <input
              className="search-input"
              placeholder="Tìm theo Material Code, SSCC..."
              type="text"
            />
          </div>
          <div className="filter-buttons">
            <button className="filter-button">
              <span className="material-symbols-outlined">calendar_month</span>
              <span>Theo ngày</span>
            </button>
            <button className="filter-button">
              <span className="material-symbols-outlined">filter_list</span>
              <span>Bộ lọc</span>
            </button>
          </div>
        </div>

        <div className="transaction-list">
          {/* Lặp qua các nhóm ngày trong dữ liệu */}
          {Object.entries(historyData).map(([date, transactions]) => (
            <div key={date} className="transaction-group">
              <h2 className="group-title">{date}</h2>
              {/* Lặp qua các giao dịch trong mỗi nhóm */}
              {transactions.map((item) => (
                <div key={item.id} className="transaction-item">
                  <div className={`item-icon-wrapper ${item.type}`}>
                    <span className="material-symbols-outlined">
                      {item.type === "in" ? "add_circle" : "local_gas_station"}
                    </span>
                  </div>
                  <div className="item-details">
                    <p className="item-title">{item.title}</p>
                    <p className="item-subtitle">{item.subtitle}</p>
                  </div>
                  <div className="item-amount">
                    <p className={`amount-value ${item.type}`}>
                      {item.type === "in"
                        ? `+ ${item.amount}L`
                        : `- ${Math.abs(item.amount)}L`}
                    </p>
                    <p className="amount-remaining">
                      {typeof item.remaining === "number"
                        ? `Còn lại ${item.remaining}L`
                        : item.remaining}
                    </p>
                  </div>
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
