import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Import các component
import MainLayout from "./components/MainLayout";
import LoginPage from "./components/LoginPage";
import ListTankOilPage from "./components/listtankoil";
import HistoryTankOilPage from "./components/HistoryTankOil";
import InputSsccPage from "./components/Inputsscc";
import MixedHistoryPage from "./components/MixedHistoryPage";
import AuditTrailPage from "./components/AuditTrailPage"; // THÊM IMPORT

// Dữ liệu mẫu ban đầu (chỉ dùng khi localStorage trống)
const initialTanksData = [
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
        timestamp: "2025-11-26T10:00:00Z",
      },
      {
        event: "Chuyển cont -5°C",
        location: "Cont -5",
        timestamp: "2025-11-27T08:00:00Z",
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
        timestamp: "2025-11-27T11:00:00Z",
      },
    ],
  },
];

function App() {
  // ĐỌC DỮ LIỆU TỪ LOCALSTORAGE KHI KHỞI ĐỘNG
  const [tanks, setTanks] = useState(() => {
    try {
      const savedTanks = localStorage.getItem("tanksData");
      return savedTanks ? JSON.parse(savedTanks) : initialTanksData;
    } catch (error) {
      console.error("Lỗi khi đọc dữ liệu từ localStorage:", error);
      return initialTanksData;
    }
  });

  // LƯU DỮ LIỆU VÀO LOCALSTORAGE KHI STATE THAY ĐỔI
  useEffect(() => {
    try {
      localStorage.setItem("tanksData", JSON.stringify(tanks));
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu vào localStorage:", error);
    }
  }, [tanks]);

  // HÀM DI CHUYỂN TANK (PHIÊN BẢN NÂNG CẤP)
  const handleMoveTank = (tankId, newLocation, eventName, customTimestamp) => {
    setTanks((currentTanks) =>
      currentTanks.map((tank) => {
        if (tank.id === tankId) {
          const timestamp = customTimestamp || new Date().toISOString();
          const newHistoryEntry = {
            event: eventName,
            location: newLocation,
            timestamp,
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

  // HÀM THÊM TANK MỚI (PHIÊN BẢN NÂNG CẤP)
  const handleAddTanks = (newTanksFromInput) => {
    setTanks((currentTanks) => {
      const maxId = currentTanks.reduce(
        (max, tank) => Math.max(tank.id, max),
        0
      );
      const tanksToAdd = newTanksFromInput.map((tank, index) => ({
        ...tank,
        id: maxId + index + 1,
        location: "Cont -20",
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

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

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
          {/* THÊM ROUTE MỚI CHO TRANG BÁO CÁO */}
          <Route
            path="/audit-trail"
            element={<AuditTrailPage tanks={tanks} />}
          />
          <Route
            path="/add-tank"
            element={
              <InputSsccPage onAddTanks={handleAddTanks} tanks={tanks} />
            }
          />
          <Route
            path="/tank/:id"
            element={<HistoryTankOilPage tanks={tanks} />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/tanks" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
