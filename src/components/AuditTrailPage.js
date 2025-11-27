import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/audittrail.css"; // CSS mới cho trang này

// Hàm hỗ trợ định dạng thời gian
const formatTimestamp = (timestamp) => {
  if (!timestamp) return "N/A";
  return new Date(timestamp).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Hàm xử lý dữ liệu để tạo bảng
const processDataForTable = (tanks) => {
  return tanks.map((tank) => {
    const row = {
      materialCode: tank.code,
      sscc: tank.sscc,
      batch: tank.batch,
      cont20: null,
      cont5: null,
      aroma: null,
      mixing: null,
    };

    // Duyệt qua lịch sử để lấy timestamp cho từng giai đoạn
    tank.history.forEach((entry) => {
      switch (entry.location) {
        case "Cont -20":
          row.cont20 = entry.timestamp;
          break;
        case "Cont -5":
          row.cont5 = entry.timestamp;
          break;
        case "Aroma Room":
          row.aroma = entry.timestamp;
          break;
        case "Mixing":
        case "Đã trộn": // Bao gồm cả trạng thái cuối cùng
          row.mixing = entry.timestamp;
          break;
        default:
          break;
      }
    });
    return row;
  });
};

function AuditTrailPage({ tanks }) {
  const navigate = useNavigate();
  const tableData = useMemo(() => processDataForTable(tanks), [tanks]);

  return (
    <div className="page-wrapper audit-page">
      <header className="audit-header">
        <button className="header-button" onClick={() => navigate(-1)}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="header-title">Báo cáo truy xuất</h1>
        <div className="header-placeholder"></div>
      </header>

      <main className="audit-main">
        <div className="table-container">
          <table className="audit-table">
            <thead>
              <tr>
                <th>Material Code</th>
                <th>SSCC</th>
                <th>Batch</th>
                <th>Cont -20°C</th>
                <th>Cont -5°C</th>
                <th>Aroma Room</th>
                <th>Mixing</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td>{row.materialCode}</td>
                  <td>{row.sscc}</td>
                  <td>{row.batch}</td>
                  <td>{formatTimestamp(row.cont20)}</td>
                  <td>{formatTimestamp(row.cont5)}</td>
                  <td>{formatTimestamp(row.aroma)}</td>
                  <td>{formatTimestamp(row.mixing)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default AuditTrailPage;
