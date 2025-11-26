import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../assets/styles/detailtankoil.css'; // Tạo file CSS mới

function DetailTankOilPage({ tanks }) {
  const { id } = useParams();
  const tank = tanks.find(t => t.id === parseInt(id));

  if (!tank) {
    return (
      <div className="detail-container">
        <p>Không tìm thấy thông tin tank.</p>
        <Link to="/tanks">Quay lại danh sách</Link>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <header className="detail-header">
        <Link to="/tanks" className="back-button">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="detail-title">Chi tiết Tank Dầu</h1>
      </header>

      <main>
        {/* Thông tin cơ bản */}
        <div className="info-section">
          <div className="info-item">
            <span className="info-label">Mã Tank</span>
            <span className="info-value code">{tank.code}</span>
          </div>
          <div className="info-item">
            <span className="info-label">SSCC</span>
            <span className="info-value">{tank.sscc}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Vị trí hiện tại</span>
            <span className="info-value location">{tank.location}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Shelf Life</span>
            <span className="info-value">{tank.percentage}%</span>
          </div>
        </div>

        {/* Lịch sử di chuyển (Traceability) */}
        <div className="history-section">
          <h2 className="history-title">Lịch sử di chuyển</h2>
          <ul className="history-list">
            {tank.history.slice().reverse().map((entry, index) => (
              <li key={index} className="history-item">
                <div className="history-icon-wrapper">
                  <span className="material-symbols-outlined history-icon">
                    {entry.event === "Nhập kho" && "inventory_2"}
                    {entry.event === "Chuyển kho" && "move_up"}
                    {entry.event === "Lấy lên phòng" && "thermostat"}
                    {entry.event === "Đưa vào trộn" && "blender"}
                  </span>
                </div>
                <div className="history-details">
                  <p className="history-event">{entry.event}: <strong>{entry.location}</strong></p>
                  <p className="history-timestamp">
                    {new Date(entry.timestamp).toLocaleString('vi-VN')}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default DetailTankOilPage;
