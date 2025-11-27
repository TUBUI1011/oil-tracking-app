import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Giả sử các file component của bạn nằm trong thư mục 'components'
import MainLayout from "./components/MainLayout";
import LoginPage from "./components/LoginPage";
import ListTankOilPage from "./components/ListTankOil"; // Sửa lại tên file nếu cần
import HistoryTankOilPage from "./components/HistoryTankOil";
import InputSsccPage from "./components/Inputsscc";
import MixedHistoryPage from "./components/MixedHistoryPage";

// Dữ liệu mẫu
const initialTanks = [
  {
    id: 1,
    code: "44456789",
    sscc: "37634563456",
    batch: "56789045",
    location: "Cont -5",
    history: [
      {
        event: "Nhập kho",
        location: "Cont -20",
        timestamp: new Date().toISOString(),
      },
      {
        event: "Chuyển cont -5°C",
        location: "Cont -5",
        timestamp: new Date().toISOString(),
      },
    ],
  },
  {
    id: 2,
    code: "12345678",
    sscc: "9876543210",
    batch: "112233",
    location: "Cont -20",
    history: [
      {
        event: "Nhập kho",
        location: "Cont -20",
        timestamp: new Date().toISOString(),
      },
    ],
  },
];

function App() {
  const [tanks, setTanks] = useState(initialTanks);

  // SỬA LẠI: Nâng cấp handleMoveTank để nhận timestamp tùy chọn
  const handleMoveTank = (tankId, newLocation, eventName, customTimestamp) => {
    setTanks((currentTanks) =>
      currentTanks.map((tank) => {
        if (tank.id === tankId) {
          // Nếu có customTimestamp thì dùng, không thì tạo mới
          const timestamp = customTimestamp || new Date().toISOString();
          const newHistoryEntry = {
            event: eventName,
            location: newLocation,
            timestamp: timestamp,
          };
          return {
            ...tank,
            location: newLocation,
            history: [...tank.history, newHistoryEntry],
          };
        }
        return tank;
      })
    );
  };

  const handleAddTanks = (newTanks) => {
    setTanks((prevTanks) => [...prevTanks, ...newTanks]);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Layout chính chứa các trang cần sidebar */}
        <Route element={<MainLayout />}>
          <Route
            path="/tanks"
            element={
              <ListTankOilPage
                tanks={tanks.filter((t) => t.location !== "Đã trộn")}
                onMoveTank={handleMoveTank}
              />
            }
          />
          <Route path="/history" element={<MixedHistoryPage tanks={tanks} />} />
          <Route
            path="/add-tank"
            // SỬA LẠI: Truyền thêm prop 'tanks'
            element={
              <InputSsccPage onAddTanks={handleAddTanks} tanks={tanks} />
            }
          />
          <Route
            path="/tank/:id"
            element={<HistoryTankOilPage tanks={tanks} />}
          />
        </Route>

        {/* Điều hướng mặc định */}
        <Route path="*" element={<Navigate to="/tanks" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
