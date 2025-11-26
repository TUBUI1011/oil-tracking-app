import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Import các component
import MainLayout from "./MainLayout"; // Import layout mới
import LoginPage from "./LoginPage";
import ListTankOilPage from "./ListTankOil";
import HistoryTankOilPage from "./HistoryTankOil";
import InputSsccPage from "./Inputsscc";
import MixedHistoryPage from "./MixedHistoryPage"; // <-- ĐÂY LÀ DÒNG QUAN TRỌNG CẦN THÊM

// --- DỮ LIỆU MẪU BAN ĐẦU (Dùng khi localStorage trống) ---
const initialTanksData = [
  {
    id: 1,
    code: "OR001",
    sscc: "SSCC001XYZ",
    percentage: 85,
    location: "Cont -20",
    history: [
      {
        event: "Nhập kho",
        location: "Cont -20",
        timestamp: "2025-11-25T10:00:00Z",
      },
    ],
  },
];

function App() {
  // --- BƯỚC 1: ĐỌC DỮ LIỆU TỪ LOCALSTORAGE KHI KHỞI ĐỘNG ---
  const [tanks, setTanks] = useState(() => {
    try {
      const savedTanks = localStorage.getItem("tanksData");
      // Nếu có dữ liệu đã lưu, parse nó ra. Nếu không, dùng dữ liệu mẫu.
      return savedTanks ? JSON.parse(savedTanks) : initialTanksData;
    } catch (error) {
      console.error("Failed to parse tanks data from localStorage", error);
      return initialTanksData;
    }
  });

  // --- BƯỚC 2: LƯU DỮ LIỆU VÀO LOCALSTORAGE KHI STATE THAY ĐỔI ---
  useEffect(() => {
    try {
      // Chuyển mảng tanks thành chuỗi JSON và lưu lại
      localStorage.setItem("tanksData", JSON.stringify(tanks));
    } catch (error) {
      console.error("Failed to save tanks data to localStorage", error);
    }
  }, [tanks]); // Hook này sẽ chạy lại mỗi khi state 'tanks' thay đổi

  // --- HÀM XỬ LÝ QUY TRÌNH CHÍNH ---
  const handleMoveTank = (tankId, newLocation, eventName) => {
    setTanks((currentTanks) =>
      currentTanks.map((tank) => {
        if (tank.id === tankId) {
          // Tạo một bản ghi lịch sử mới
          const newHistoryEntry = {
            event: eventName,
            location: newLocation,
            timestamp: new Date().toISOString(),
          };
          // Cập nhật tank với vị trí và lịch sử mới (immutable)
          return {
            ...tank,
            location: newLocation,
            history: [...tank.history, newHistoryEntry],
          };
        }
        return tank;
      })
    );
    console.log(`Moved tank ${tankId} to ${newLocation}`);
  };

  // --- THÊM HÀM NÀY ĐỂ XỬ LÝ VIỆC NHẬP KHO ---
  const handleAddTanks = (newTanks) => {
    setTanks((currentTanks) => {
      // Tìm ID lớn nhất hiện có để tạo ID mới không trùng lặp
      const maxId = currentTanks.reduce(
        (max, tank) => Math.max(tank.id, max),
        0
      );

      // Chuẩn hóa dữ liệu tank mới
      const tanksToAdd = newTanks.map((tank, index) => ({
        ...tank,
        id: maxId + index + 1, // Tạo ID mới
        location: "Cont -20", // Luôn nhập vào Cont -20
        percentage: 100, // Mặc định khi nhập kho
        history: [
          {
            event: "Nhập kho",
            location: "Cont -20",
            timestamp: new Date().toISOString(),
          },
        ],
      }));

      return [...currentTanks, ...tanksToAdd];
    });
  };

  // --- ROUTER (Giữ nguyên) ---
  return (
    <Router>
      <Routes>
        {/* Route cho trang Login, nằm ngoài layout chính */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Các route có điều hướng sẽ nằm trong MainLayout */}
        <Route element={<MainLayout />}>
          <Route
            path="/tanks"
            element={
              <ListTankOilPage tanks={tanks} onMoveTank={handleMoveTank} />
            }
          />
          <Route path="/history" element={<MixedHistoryPage tanks={tanks} />} />
          <Route
            path="/add-tank"
            element={<InputSsccPage onAddTanks={handleAddTanks} />}
          />
          <Route
            path="/tank/:id"
            element={<HistoryTankOilPage tanks={tanks} />}
          />
        </Route>

        {/* Route bắt lỗi, có thể để ở cuối */}
        <Route path="*" element={<Navigate to="/tanks" replace />} />
      </Routes>
    </Router>
  );
}

// 3. EXPORT APP ĐỂ SỬ DỤNG TRONG index.js
export default App;
