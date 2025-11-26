import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../assets/styles/detailtankoil.css";

// --- DỮ LIỆU MẪU (Giống như trong file listtankoil.js) ---
const tanksData = [
  {
    id: 1,
    code: "OIL-A-123",
    sscc: "00123456789012345678",
    percentage: 85,
    liters: 850,
    capacity: 1000,
    status: "Đang sử dụng",
  },
  {
    id: 2,
    code: "OIL-B-456",
    sscc: "00987654321098765432",
    percentage: 60,
    liters: 600,
    capacity: 1000,
    status: "Đang sử dụng",
  },
  {
    id: 3,
    code: "OIL-C-789",
    sscc: "0055543219876543210",
    percentage: 25,
    liters: 250,
    capacity: 1000,
    status: "Sắp hết",
  },
  {
    id: 4,
    code: "OIL-D-101",
    sscc: "0031415926535897932",
    percentage: 95,
    liters: 1900,
    capacity: 2000,
    status: "Đầy",
  },
];

// --- COMPONENT CON CHO HÌNH ẢNH TANK DẦU (SVG) ---
function TankVisual({ percentage }) {
  const fillOffset = 100 - percentage; // Tính toán điểm bắt đầu đổ màu

  return (
    <div className="tank-svg-wrapper">
      <svg fill="none" viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="tankFill" x1="0" x2="0" y1="0" y2="100%">
            {/* Phần trống */}
            <stop
              offset="0%"
              style={{ stopColor: "rgb(228, 225, 209)", stopOpacity: 1 }}
            />
            <stop
              offset={`${fillOffset}%`}
              style={{ stopColor: "rgb(228, 225, 209)", stopOpacity: 1 }}
            />
            {/* Phần đầy */}
            <stop
              offset={`${fillOffset}%`}
              style={{ stopColor: "rgb(240, 211, 66)", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "rgb(240, 211, 66)", stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>
        <path
          d="M10 10C10 4.47715 14.4772 0 20 0H80C85.5228 0 90 4.47715 90 10V110H10V10Z"
          fill="url(#tankFill)"
        />
        <path
          className="tank-base"
          d="M10 110H90V120C90 125.523 85.5228 130 80 130H20C14.4772 130 10 125.523 10 120V110Z"
        />
        <rect className="tank-base" height="10" width="100" x="0" y="105" />
        <path
          className="tank-outline"
          d="M20 0H80C85.5228 0 90 4.47715 90 10V120C90 125.523 85.5228 130 80 130H20C14.4772 130 10 125.523 10 120V10C10 4.47715 14.4772 0 20 0ZM88 10C88 5.58172 84.4183 2 80 2H20C15.5817 2 12 5.58172 12 10V120C12 124.418 15.5817 128 20 128H80C84.4183 128 88 124.418 88 120V10Z"
        />
      </svg>
      <div className="tank-text-overlay">
        <span className="tank-percentage">{percentage}%</span>
        <span className="tank-label">Mức dầu hiện tại</span>
      </div>
    </div>
  );
}

// --- COMPONENT CHÍNH ---
function DetailTankOilPage() {
  const { id } = useParams(); // Lấy id từ URL, ví dụ: /tank/1 -> id = '1'
  const navigate = useNavigate(); // Hook để điều hướng, ví dụ: quay lại trang trước

  // Tìm tank tương ứng trong dữ liệu. Chuyển id từ string sang number để so sánh.
  const tank = tanksData.find((t) => t.id === parseInt(id));

  // Nếu không tìm thấy tank, hiển thị thông báo
  if (!tank) {
    return (
      <div className="page-wrapper">
        <h1 style={{ textAlign: "center", marginTop: "2rem" }}>
          Không tìm thấy tank dầu!
        </h1>
        <button
          onClick={() => navigate("/tanks")}
          style={{ margin: "1rem auto", display: "block" }}
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* TopAppBar */}
      <header className="detail-header">
        <button className="header-button" onClick={() => navigate(-1)}>
          {" "}
          {/* Quay lại trang trước */}
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="header-title">Chi tiết Tank Dầu</h1>
        <div className="header-placeholder"></div>
      </header>

      <main className="detail-main">
        {/* Tank Visual Representation */}
        <div className="tank-visual-container">
          <TankVisual percentage={tank.percentage} />
        </div>

        {/* DescriptionList */}
        <div className="description-list-container">
          <div className="description-card">
            <div className="description-item">
              <p className="item-label">Trạng thái</p>
              <div className="status-indicator">
                <div className="status-dot-wrapper">
                  <span className="status-dot-ping"></span>
                  <span className="status-dot-solid"></span>
                </div>
                <p className="item-value">{tank.status}</p>
              </div>
            </div>
            <hr className="item-divider" />
            <div className="description-item">
              <p className="item-label">Material Code</p>
              <p className="item-value">{tank.code}</p>
            </div>
            <hr className="item-divider" />
            <div className="description-item">
              <p className="item-label">SSCC</p>
              <p className="item-value">{tank.sscc}</p>
            </div>
            <hr className="item-divider" />
            <div className="description-item">
              <p className="item-label">Dung tích</p>
              <p className="item-value">
                {tank.liters}L / {tank.capacity}L
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ButtonGroup */}
      <footer className="detail-footer">
        <div className="button-group">
          <button className="footer-button button-primary">Lấy Dầu</button>
          <Link
            to={`/history/${tank.id}`}
            className="footer-button button-secondary"
            style={{ textDecoration: "none" }}
          >
            Xem Lịch Sử Giao Dịch
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default DetailTankOilPage;
