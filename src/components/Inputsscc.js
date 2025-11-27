import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx"; // Import thư viện xlsx
import "../assets/styles/inputsscc.css";

// SỬA LẠI: Nhận thêm prop 'tanks'
function InputSsccPage({ onAddTanks, tanks }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Ref để trỏ tới input file ẩn

  // State cho form nhập tay
  const [materialCode, setMaterialCode] = useState("");
  const [sscc, setSscc] = useState("");
  const [batch, setBatch] = useState("");

  // State để hiển thị dữ liệu từ Excel
  const [excelData, setExcelData] = useState([]);

  // --- XỬ LÝ NHẬP TAY (PHIÊN BẢN NÂNG CẤP) ---
  const handleManualSave = () => {
    // Trim tất cả các giá trị đầu vào để loại bỏ khoảng trắng thừa
    const trimmedCode = materialCode.trim();
    const trimmedSscc = sscc.trim();
    const trimmedBatch = batch.trim();

    // 1. Kiểm tra xem các trường có bị bỏ trống không
    if (!trimmedCode || !trimmedSscc || !trimmedBatch) {
      alert(
        "Lỗi: Vui lòng điền đầy đủ thông tin Material Code, SSCC và Batch."
      );
      return; // Dừng lại nếu có trường trống
    }

    // 2. Kiểm tra xem SSCC đã tồn tại trong hệ thống chưa
    // So sánh không phân biệt chữ hoa chữ thường để chắc chắn hơn
    const isDuplicate = tanks.some(
      (tank) => tank.sscc.toLowerCase() === trimmedSscc.toLowerCase()
    );

    if (isDuplicate) {
      // Nếu trùng, hiển thị cảnh báo lỗi và dừng lại
      alert(
        `Lỗi: SSCC "${trimmedSscc}" đã tồn tại trong hệ thống. Vui lòng kiểm tra lại.`
      );
      return;
    }

    // 3. Nếu tất cả kiểm tra đều qua, tiến hành thêm mới
    const newTank = {
      code: trimmedCode,
      sscc: trimmedSscc,
      batch: trimmedBatch,
    };

    onAddTanks([newTank]); // Gọi hàm để thêm tank vào state chung

    // Hiển thị thông báo thành công
    alert(`Thành công! Đã thêm Tank với SSCC "${trimmedSscc}" vào Cont -20°C.`);

    // Quay về trang danh sách
    navigate("/tanks");
  };

  // --- XỬ LÝ UPLOAD FILE ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Bỏ dòng header, map dữ liệu thành object
      const formattedData = json
        .slice(1)
        .map((row) => ({
          // SỬA LẠI Ở ĐÂY: Ép kiểu tất cả các giá trị thành chuỗi
          code: String(row[0] || ""),
          sscc: String(row[1] || ""),
          batch: String(row[2] || ""),
        }))
        .filter((item) => item.code && item.sscc); // Lọc bỏ dòng trống

      setExcelData(formattedData);
    };
    reader.readAsArrayBuffer(file);
  };

  // --- XÁC NHẬN THÊM TỪ FILE EXCEL ---
  const handleConfirmExcel = () => {
    if (excelData.length === 0) return;

    // THÊM: Kiểm tra SSCC trùng lặp trong file và với hệ thống
    const existingSsccs = new Set(tanks.map((tank) => tank.sscc));
    const duplicates = [];
    const seenInFile = new Set();

    for (const item of excelData) {
      if (existingSsccs.has(item.sscc) || seenInFile.has(item.sscc)) {
        duplicates.push(item.sscc);
      }
      seenInFile.add(item.sscc);
    }

    if (duplicates.length > 0) {
      alert(
        `Lỗi: Các SSCC sau đã bị trùng lặp hoặc đã tồn tại trong hệ thống:\n\n${[
          ...new Set(duplicates),
        ].join("\n")}\n\nVui lòng kiểm tra lại file Excel.`
      );
      return;
    }

    onAddTanks(excelData);
    alert(`Đã thêm ${excelData.length} tank mới vào Cont -20!`);
    navigate("/tanks");
  };

  return (
    <div className="page-container">
      <header className="sscc-header">
        <button className="header-button" onClick={() => navigate(-1)}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="header-title">Nhập Kho Tank Dầu</h1>
        {/* THÊM: Placeholder để căn giữa tiêu đề một cách chính xác */}
        <div className="header-placeholder"></div>
      </header>

      <main className="sscc-main">
        {/* --- PHẦN NHẬP TAY --- */}
        <div className="form-wrapper">
          <h2 className="section-title">Nhập thủ công</h2>
          <div className="form-group">
            <p className="form-label">Material Code</p>
            <input
              className="form-input"
              placeholder="Nhập mã material"
              value={materialCode}
              onChange={(e) => setMaterialCode(e.target.value)}
            />
          </div>
          <div className="form-group">
            <p className="form-label">SSCC</p>
            <input
              className="form-input"
              placeholder="Nhập mã SSCC"
              value={sscc}
              onChange={(e) => setSscc(e.target.value)}
            />
          </div>
          <div className="form-group">
            <p className="form-label">Batch</p>
            <input
              className="form-input"
              placeholder="Nhập số batch"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
            />
          </div>
          <button className="save-button" onClick={handleManualSave}>
            Lưu thông tin
          </button>
        </div>

        <div className="divider-container">
          <div className="divider-line"></div>
          <span className="divider-text">hoặc</span>
          <div className="divider-line"></div>
        </div>

        {/* --- PHẦN UPLOAD EXCEL --- */}
        <div className="form-wrapper">
          <h2 className="section-title">Tải lên từ file Excel</h2>
          <p className="upload-note">
            File Excel cần có 3 cột theo thứ tự: Material Code, SSCC, Batch.
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: "none" }}
            accept=".xlsx, .xls"
          />
          <button
            className="upload-button"
            onClick={() => fileInputRef.current.click()}
          >
            <span className="material-symbols-outlined">upload_file</span>
            Chọn file Excel để tải lên
          </button>
        </div>

        {/* --- BẢNG XEM TRƯỚC DỮ LIỆU EXCEL --- */}
        {excelData.length > 0 && (
          <div className="excel-preview-wrapper">
            <h2 className="section-title">
              Dữ liệu xem trước ({excelData.length} tank)
            </h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Material Code</th>
                    <th>SSCC</th>
                    <th>Batch</th>
                  </tr>
                </thead>
                <tbody>
                  {excelData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.code}</td>
                      <td>{row.sscc}</td>
                      <td>{row.batch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="confirm-button" onClick={handleConfirmExcel}>
              Xác nhận và Thêm vào kho
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default InputSsccPage;
