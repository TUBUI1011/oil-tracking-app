import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// 1. IMPORT TẤT CẢ CÁC TRANG (COMPONENT)
// Tên file và tên component đã được đồng bộ hóa
import LoginPage from "./LoginPage";
import ListTankOilPage from "./ListTankOil";
import DetailTankOilPage from "./DetailTankOil";
import HistoryTankOilPage from "./HistoryTankOil";
import InputSsccPage from "./Inputsscc";
import CaiDatPage from "./CaiDat"; // Giả sử file tên là CaiDat.js
import ThongKePage from "./ThongKe";

// 2. ĐỊNH NGHĨA BỘ ĐỊNH TUYẾN (ROUTER)
function App() {
  return (
    <Router>
      <Routes>
        {/* --- CÁC ĐƯỜNG DẪN CỦA ỨNG DỤNG --- */}
        {/* Route mặc định và route cho trang đăng nhập */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Route cho các trang chính */}
        <Route path="/tanks" element={<ListTankOilPage />} />
        <Route path="/tank/:id" element={<DetailTankOilPage />} />
        <Route path="/history/:id" element={<HistoryTankOilPage />} />
        <Route path="/add-tank" element={<InputSsccPage />} />
        <Route path="/settings" element={<CaiDatPage />} />
        <Route path="/report" element={<ThongKePage />} />{" "}
        {/* Bổ sung route cho trang thống kê */}
        {/* Route cho các trang chưa tạo (ví dụ) */}
        {/* <Route path="/usage" element={<UsagePage />} /> */}
        {/* <Route path="/info" element={<InfoPage />} /> */}
        {/* Route bắt lỗi: Nếu không khớp với bất kỳ đường dẫn nào ở trên, điều hướng về trang chủ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

// 3. EXPORT APP ĐỂ SỬ DỤNG TRONG index.js
export default App;
