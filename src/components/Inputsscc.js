import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/inputsscc.css';


// ĐỊNH NGHĨA COMPONENT (Tên viết hoa chữ cái đầu)
function InputSsccPage() {
  const navigate = useNavigate();

  // State để quản lý giá trị của từng ô input
  const [materialCode, setMaterialCode] = useState(''); // Material Code
  const [sscc, setSscc] = useState(''); // SSCC number
  const [capacity, setCapacity] = useState(''); // Dung tích tank (lít)
  const [status, setStatus] = useState('Đang sử dụng'); // Giá trị mặc định cho select


// Trả về mã JSX (HTML đã được chuyển đổi)
  return (
    <div className="page-container">
      <header className="sscc-header">
        <button className="header-button" onClick={() => navigate(-1)}>
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h1 className="header-title">Quản lý Tank Dầu</h1>
        <div className="header-placeholder"></div>
      </header>

      <main className="sscc-main">
        <div className="form-wrapper">
          <div className="form-group">
            <p className="form-label">Material Code</p>
            <div className="input-wrapper">
              <input
                className="form-input"
                placeholder="Nhập mã material"
                value={materialCode}
                onChange={(e) => setMaterialCode(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <p className="form-label">SSCC</p>
            <div className="input-wrapper">
              <input
                className="form-input"
                placeholder="Nhập mã SSCC"
                value={sscc}
                onChange={(e) => setSscc(e.target.value)}
                style={{ paddingRight: '3.5rem' }}
              />
              <button className="input-icon-button">
                <span className="material-symbols-outlined">qr_code_scanner</span>
              </button>
            </div>
          </div>

          <div className="form-group">
            <p className="form-label">Dung tích tank (lít)</p>
            <div className="input-wrapper">
              <input
                className="form-input"
                placeholder="Ví dụ: 1000"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <p className="form-label">Trạng thái</p>
            <div className="input-wrapper">
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>Đang sử dụng</option>
                <option>Trống</option>
                <option>Đang bơm</option>
                <option>Bảo trì</option>
              </select>
              <div className="select-arrow-icon">
                <span className="material-symbols-outlined">expand_more</span>
              </div>
            </div>
          </div>

          <div className="divider-container">
            <div className="divider-line"></div>
            <span className="divider-text">hoặc</span>
            <div className="divider-line"></div>
          </div>

          <button className="upload-button">
            <span className="material-symbols-outlined">upload_file</span>
            Tải lên dữ liệu
          </button>
        </div>
      </main>

      <footer className="sscc-footer">
        <button className="save-button">Lưu thông tin</button>
      </footer>
    </div>
  );
}

export default InputSsccPage;