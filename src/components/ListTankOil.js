import React, { useState, useMemo, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import "../assets/styles/listtankoil.css"; // Sử dụng file CSS đã được làm lại

// --- COMPONENT CON: MODAL XÁC NHẬN (Giữ nguyên) ---
const ConfirmationModal = ({ tank, onConfirm, onClose }) => {
  // State chỉ để lưu trữ ngày và giờ có thể chỉnh sửa
  const [editableDateTime, setEditableDateTime] = useState({
    date: "",
    time: "",
  });

  // Hàm để lấy ngày và giờ hiện tại theo định dạng input
  const getFormattedDateTime = () => {
    const now = new Date();
    const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const time = now.toTimeString().slice(0, 5); // HH:MM
    return { date, time };
  };

  // Khi modal mở, thiết lập ngày giờ hiện tại
  useEffect(() => {
    if (tank) {
      const { date, time } = getFormattedDateTime();
      setEditableDateTime({ date, time });
    }
  }, [tank]);

  if (!tank) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableDateTime((prev) => ({ ...prev, [name]: value }));
  };

  // Hàm xử lý khi bấm nút xác nhận
  const handleConfirmClick = () => {
    // Gộp ngày và giờ thành một đối tượng Date hoàn chỉnh
    const combinedTimestamp = new Date(
      `${editableDateTime.date}T${editableDateTime.time}`
    );

    // Tạo đối tượng dữ liệu cuối cùng để gửi đi
    // Chỉ cần gửi timestamp đã được chỉnh sửa
    const finalData = {
      // Giữ lại thông tin gốc để hàm cha không bị lỗi
      code: tank.code,
      sscc: tank.sscc,
      batch: tank.batch,
      // Thêm timestamp đã được chỉnh sửa
      timestamp: combinedTimestamp.toISOString(),
    };

    onConfirm(finalData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Xác nhận Lấy Tank</h3>
        </div>
        <div className="modal-info-grid">
          {/* SỬA LẠI: Hiển thị dưới dạng văn bản không thể sửa */}
          <p className="modal-info-label">Material Code</p>
          <p className="modal-info-value">{tank.code}</p>

          <p className="modal-info-label">SSCC</p>
          <p className="modal-info-value">{tank.sscc}</p>

          <p className="modal-info-label">Batch</p>
          <p className="modal-info-value">{tank.batch || "N/A"}</p>

          {/* GIỮ NGUYÊN: Cho phép sửa ngày và giờ */}
          <p className="modal-info-label">Ngày lấy</p>
          <input
            type="date"
            name="date"
            value={editableDateTime.date}
            onChange={handleInputChange}
            className="modal-info-input"
          />

          <p className="modal-info-label">Giờ lấy</p>
          <input
            type="time"
            name="time"
            value={editableDateTime.time}
            onChange={handleInputChange}
            className="modal-info-input"
          />
        </div>
        <div className="modal-actions">
          <button className="modal-button cancel" onClick={onClose}>
            Hủy
          </button>
          <button className="modal-button confirm" onClick={handleConfirmClick}>
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

// --- THÊM COMPONENT MỚI: MODAL NHẬP NHIỆT ĐỘ ---
const TemperatureModal = ({ onConfirm, onClose }) => {
  const [temperature, setTemperature] = useState("");

  const handleConfirmClick = () => {
    const tempValue = parseFloat(temperature);
    if (isNaN(tempValue)) {
      alert("Vui lòng nhập một giá trị nhiệt độ hợp lệ.");
      return;
    }
    // Kiểm tra điều kiện nhiệt độ
    if (tempValue >= 23 && tempValue <= 25) {
      onConfirm(tempValue); // Gọi hàm xác nhận nếu hợp lệ
    } else {
      alert(
        "Nhiệt độ phải trong khoảng từ 23°C đến 25°C. Vui lòng kiểm tra lại."
      );
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Xác nhận nhiệt độ Tank</h3>
        </div>
        <div className="modal-input-group"></div>
        <label htmlFor="temperature" className="modal-input-label">
          Nhiệt độ (°C)
        </label>
        <input
          type="number"
          id="temperature"
          name="temperature"
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
          className="modal-input"
          placeholder="Nhập nhiệt độ từ 23 - 25"
          autoFocus
        />
      </div>
      <div className="modal-actions">
        <button className="modal-button cancel" onClick={onClose}>
          Hủy
        </button>
        <button className="modal-button confirm" onClick={handleConfirmClick}>
          Xác nhận
        </button>
      </div>
    </div>
  );
};

// --- COMPONENT CON: TANK CARD (PHIÊN BẢN HOÀN THIỆN) ---
const TankCard = ({ tank, action, onMoveTank, onAction }) => {
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let totalDurationMs = 0;

    if (tank.location === "Cont -5") {
      totalDurationMs = 24 * 60 * 60 * 1000;
    } else if (tank.location === "Aroma Room") {
      totalDurationMs = 30 * 60 * 60 * 1000;
    } else {
      setIsReady(true);
      setProgress(100);
      setDisplayText("Sẵn sàng");
      return;
    }

    const currentHistoryEntry = tank.history[tank.history.length - 1];
    if (!currentHistoryEntry) return;

    const entryTime = new Date(currentHistoryEntry.timestamp).getTime();

    const updateDisplay = () => {
      const now = new Date().getTime();
      const elapsedTime = now - entryTime;
      const remainingTime = totalDurationMs - elapsedTime;

      // Đảm bảo % và thời gian luôn đồng bộ
      const calculatedProgress = Math.min(
        (elapsedTime / totalDurationMs) * 100,
        100
      );
      setProgress(calculatedProgress);

      if (remainingTime <= 0) {
        setIsReady(true);
        setDisplayText("Sẵn sàng");
        clearInterval(interval);
      } else {
        setIsReady(false);
        const hours = Math.floor(remainingTime / (1000 * 60 * 60));
        const minutes = Math.floor(
          (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
        );

        // THÊM: Chữ "Còn" vào trước đồng hồ
        setDisplayText(
          `Còn ${String(hours).padStart(2, "0")}:${String(minutes).padStart(
            2,
            "0"
          )}`
        );
      }
    };

    updateDisplay();
    const interval = setInterval(updateDisplay, 60000); // Cập nhật mỗi phút

    return () => clearInterval(interval);
  }, [tank]);

  return (
    <div className="tank-card">
      <Link to={`/tank/${tank.id}`} className="card-main-link">
        <div className="card-header">
          <span className="material-symbols-outlined tank-icon">
            oil_barrel
          </span>
          <div className="card-title-group">
            <p className="card-title">{tank.code}</p>
            <p className="card-subtitle">{tank.sscc}</p>
            <p className="card-subtitle">{tank.batch || "N/A"}</p>
          </div>
        </div>
        <div className="card-body">
          <div className="percentage-bar-background">
            <div
              className={`percentage-bar-foreground ${isReady ? "ready" : ""}`}
              style={{ width: `${progress}%` }}
            ></div>
            {/* THÊM: Hiển thị % bên trong thanh */}
            <span className="progress-percentage-text">
              {Math.floor(progress)}%
            </span>
          </div>
          <p className={`percentage-text ${isReady ? "ready" : ""}`}>
            {displayText}
          </p>
        </div>
      </Link>
      {action && (
        <div className="card-footer">
          <button
            className="move-button"
            onClick={() =>
              onAction
                ? onAction(tank.id)
                : onMoveTank(tank.id, action.nextLocation, action.eventName)
            }
            disabled={!isReady}
          >
            <span>{action.eventName}</span>
            <span className="material-symbols-outlined">{action.icon}</span>
          </button>
        </div>
      )}
    </div>
  );
};

// --- COMPONENT CON: CỘT KANBAN (Giữ nguyên) ---
const KanbanColumn = ({ title, tanks, ...props }) => {
  return (
    <div className="kanban-column">
      <div className="kanban-column-header">
        <h2 className="kanban-column-title">{title}</h2>
        <span className="kanban-column-count">{tanks.length}</span>
      </div>
      <div className="kanban-column-body">
        {tanks.length > 0 ? (
          tanks.map((tank) => <TankCard key={tank.id} tank={tank} {...props} />)
        ) : (
          <p className="empty-text">Không có tank nào</p>
        )}
      </div>
    </div>
  );
};

// --- COMPONENT CHÍNH (NÂNG CẤP) ---
function ListTankOilPage({ tanks, onMoveTank }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalInfo, setModalInfo] = useState({
    isOpen: false,
    tank: null,
    action: null,
  });
  // THÊM: State cho modal nhiệt độ
  const [tempModalInfo, setTempModalInfo] = useState({
    isOpen: false,
    tank: null,
    action: null,
  });

  const tanksByLocation = useMemo(() => {
    const filtered = tanks.filter(
      (tank) =>
        (tank.code?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (tank.sscc?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );
    return {
      cont20: filtered.filter((t) => t.location === "Cont -20"),
      cont5: filtered.filter((t) => t.location === "Cont -5"),
      aroma: filtered.filter((t) => t.location === "Aroma Room"),
      mixing: filtered.filter((t) => t.location === "Mixing"),
    };
  }, [tanks, searchTerm]);

  // Hàm để mở modal
  const handleRequestMove = (tankId, action) => {
    const tankToMove = tanks.find((t) => t.id === tankId);
    if (tankToMove) {
      setModalInfo({ isOpen: true, tank: tankToMove, action: action });
    }
  };

  // Hàm để đóng modal
  const handleCloseModal = () => {
    setModalInfo({ isOpen: false, tank: null, action: null });
  };

  // SỬA LẠI: Hàm xác nhận giờ sẽ gọi onMoveTank với timestamp
  const handleConfirmMove = (finalData) => {
    const { tank, action } = modalInfo;
    if (tank && action) {
      // Gọi hàm onMoveTank và truyền thêm timestamp đã được chỉnh sửa
      onMoveTank(
        tank.id,
        action.nextLocation,
        action.eventName,
        finalData.timestamp // Thêm tham số timestamp
      );
    }
    handleCloseModal();
  };

  // THÊM: Hàm mở modal nhiệt độ
  const handleRequestMixing = (tankId, action) => {
    const tankToMove = tanks.find((t) => t.id === tankId);
    setTempModalInfo({ isOpen: true, tank: tankToMove, action });
  };

  // THÊM: Hàm xác nhận sau khi nhập nhiệt độ
  const handleConfirmMixing = (temperature) => {
    const { tank, action } = tempModalInfo;
    if (tank && action) {
      // Thêm thông tin nhiệt độ vào lịch sử (tùy chọn)
      const eventNameWithTemp = `${action.eventName} (Nhiệt độ: ${temperature}°C)`;
      onMoveTank(tank.id, action.nextLocation, eventNameWithTemp);
    }
    setTempModalInfo({ isOpen: false, tank: null, action: null }); // Đóng modal
  };

  return (
    <div className="page-container kanban-layout">
      {modalInfo.isOpen && (
        <ConfirmationModal
          tank={modalInfo.tank}
          onConfirm={handleConfirmMove}
          onClose={() =>
            setModalInfo({ isOpen: false, tank: null, action: null })
          }
        />
      )}
      {/* THÊM: Render modal nhiệt độ */}
      {tempModalInfo.isOpen && (
        <TemperatureModal
          onConfirm={handleConfirmMixing}
          onClose={() =>
            setTempModalInfo({ isOpen: false, tank: null, action: null })
          }
        />
      )}

      <header className="main-header">
        <h1 className="header-title">Theo dõi Tank Dầu</h1>
        <div className="search-bar-container">
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            className="search-input"
            placeholder="Tìm theo mã hoặc SSCC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <main className="kanban-board">
        <KanbanColumn
          title="Cont -20°C (Trữ đông)"
          tanks={tanksByLocation.cont20}
          onMoveTank={onMoveTank} // Lời gọi này không có timestamp, sẽ dùng giờ hiện tại
          action={{
            nextLocation: "Cont -5",
            eventName: "Chuyển cont -5°C",
            icon: "arrow_forward",
          }}
        />
        <KanbanColumn
          title="Cont -5°C (Giảm đông)"
          tanks={tanksByLocation.cont5}
          onAction={(tankId) =>
            handleRequestMove(tankId, {
              nextLocation: "Aroma Room",
              eventName: "Lấy lên phòng Aroma",
            })
          }
          action={{
            eventName: "Lấy lên phòng Aroma",
            icon: "arrow_upward",
          }}
        />
        <KanbanColumn
          title="Aroma Room (Rã đông)"
          tanks={tanksByLocation.aroma}
          // SỬA LẠI: Gọi hàm mở modal nhiệt độ
          onAction={(tankId) =>
            handleRequestMixing(tankId, {
              nextLocation: "Mixing",
              eventName: "Đưa vào trộn",
            })
          }
          action={{
            eventName: "Đưa vào trộn",
            icon: "blender",
          }}
        />
        {/* SỬA LẠI CỘT MIXING */}
        <KanbanColumn
          title="Mixing (Đang trộn)"
          tanks={tanksByLocation.mixing}
          onMoveTank={onMoveTank}
          action={{
            nextLocation: "Đã trộn", // Chuyển thẳng đến trạng thái hoàn thành
            eventName: "Trộn xong, hoàn thành", // Đổi tên sự kiện
            icon: "check_circle", // Đổi icon
          }}
        />
      </main>

      <Link to="/add-tank" className="fab-add-button">
        <span className="material-symbols-outlined">add</span>
      </Link>

      <nav className="bottom-nav">
        <NavLink
          to="/tanks"
          className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
        >
          <span className="material-symbols-outlined">view_kanban</span>
          <span>Quy trình</span>
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
        >
          <span className="material-symbols-outlined">history</span>
          <span>Lịch sử</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default ListTankOilPage;
