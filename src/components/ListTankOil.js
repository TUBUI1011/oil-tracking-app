import React, { useState, useMemo, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import "../assets/styles/listtankoil.css";

// --- MODAL XÁC NHẬN GIỜ ---
const ConfirmationModal = ({ tank, onConfirm, onClose }) => {
  const [editableDateTime, setEditableDateTime] = useState({ date: "", time: "" });

  useEffect(() => {
    if (tank) {
      const now = new Date();
      const date = now.toISOString().split("T")[0];
      const time = now.toTimeString().slice(0, 5);
      setEditableDateTime({ date, time });
    }
  }, [tank]);

  if (!tank) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableDateTime((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmClick = () => {
    const combinedTimestamp = new Date(`${editableDateTime.date}T${editableDateTime.time}`);
    onConfirm(combinedTimestamp.toISOString());
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header"><h3 className="modal-title">Xác nhận Lấy Tank</h3></div>
        <div className="modal-info-grid">
          <p className="modal-info-label">Material Code</p><p className="modal-info-value">{tank.code}</p>
          <p className="modal-info-label">SSCC</p><p className="modal-info-value">{tank.sscc}</p>
          <p className="modal-info-label">Batch</p><p className="modal-info-value">{tank.batch || "N/A"}</p>
          <p className="modal-info-label">Ngày lấy</p><input type="date" name="date" value={editableDateTime.date} onChange={handleInputChange} className="modal-info-input" />
          <p className="modal-info-label">Giờ lấy</p><input type="time" name="time" value={editableDateTime.time} onChange={handleInputChange} className="modal-info-input" />
        </div>
        <div className="modal-actions">
          <button className="modal-button cancel" onClick={onClose}>Hủy</button>
          <button className="modal-button confirm" onClick={handleConfirmClick}>Xác nhận</button>
        </div>
      </div>
    </div>
  );
};

// --- MODAL NHẬP NHIỆT ĐỘ ---
const TemperatureModal = ({ onConfirm, onClose }) => {
  const [temperature, setTemperature] = useState("");
  const handleConfirmClick = () => {
    const tempValue = parseFloat(temperature);
    if (isNaN(tempValue)) { alert("Vui lòng nhập một giá trị nhiệt độ hợp lệ."); return; }
    if (tempValue >= 23 && tempValue <= 25) { onConfirm(tempValue); } 
    else { alert("Nhiệt độ phải trong khoảng từ 23°C đến 25°C. Vui lòng kiểm tra lại."); }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header"><h3 className="modal-title">Xác nhận nhiệt độ Tank</h3></div>
        <div className="modal-input-group">
          <label htmlFor="temperature" className="modal-input-label">Nhiệt độ (°C)</label>
          <input type="number" id="temperature" value={temperature} onChange={(e) => setTemperature(e.target.value)} className="modal-input" placeholder="Nhập nhiệt độ từ 23 - 25" autoFocus />
        </div>
        <div className="modal-actions">
          <button className="modal-button cancel" onClick={onClose}>Hủy</button>
          <button className="modal-button confirm" onClick={handleConfirmClick}>Xác nhận</button>
        </div>
      </div>
    </div>
  );
};

// --- TANK CARD ---
const TankCard = ({ tank, action, onAction }) => {
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let interval = null;
    const calculateDuration = () => {
      if (tank.location === "Cont -5") return 24 * 60 * 60 * 1000;
      if (tank.location === "Aroma Room") return 30 * 60 * 60 * 1000;
      return 0;
    };
    const totalDurationMs = calculateDuration();
    if (totalDurationMs === 0) {
      setIsReady(true);
      setProgress(100);
      setDisplayText("Sẵn sàng");
    } else {
      const currentHistoryEntry = tank.history[tank.history.length - 1];
      if (!currentHistoryEntry) return;
      const entryTime = new Date(currentHistoryEntry.timestamp).getTime();
      const updateDisplay = () => {
        const now = new Date().getTime();
        const elapsedTime = now - entryTime;
        const remainingTime = totalDurationMs - elapsedTime;
        const calculatedProgress = Math.min((elapsedTime / totalDurationMs) * 100, 100);
        setProgress(calculatedProgress);
        if (remainingTime <= 0) {
          setIsReady(true);
          setDisplayText("Sẵn sàng");
          if (interval) clearInterval(interval);
        } else {
          setIsReady(false);
          const hours = Math.floor(remainingTime / (1000 * 60 * 60));
          const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
          setDisplayText(`Còn ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`);
        }
      };
      updateDisplay();
      interval = setInterval(updateDisplay, 60000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [tank]);

  return (
    <div className="tank-card">
      <Link to={`/tank/${tank.id}`} className="card-main-link">
        <div className="card-header">
          <span className="material-symbols-outlined tank-icon">oil_barrel</span>
          <div className="card-title-group">
            <p className="card-title">{tank.code}</p>
            <p className="card-subtitle">{tank.sscc}</p>
            <p className="card-subtitle">{tank.batch || "N/A"}</p>
          </div>
        </div>
        <div className="card-body">
          <div className="percentage-bar-background">
            <div className={`percentage-bar-foreground ${isReady ? "ready" : ""}`} style={{ width: `${progress}%` }}></div>
            <span className="progress-percentage-text">{Math.floor(progress)}%</span>
          </div>
          <p className={`percentage-text ${isReady ? "ready" : ""}`}>{displayText}</p>
        </div>
      </Link>
      {action && (
        <div className="card-footer">
          <button className="move-button" onClick={() => onAction(tank.id)} disabled={!isReady}>
            <span>{action.eventName}</span>
            <span className="material-symbols-outlined">{action.icon}</span>
          </button>
        </div>
      )}
    </div>
  );
};

// --- CỘT KANBAN ---
const KanbanColumn = ({ title, tanks, action, onAction }) => (
  <div className="kanban-column">
    <div className="kanban-column-header">
      <h2 className="kanban-column-title">{title}</h2>
      <span className="kanban-column-count">{tanks.length}</span>
    </div>
    <div className="kanban-column-body">
      {tanks.length > 0 ? (
        tanks.map((tank) => <TankCard key={tank.id} tank={tank} action={action} onAction={onAction} />)
      ) : (
        <p className="empty-text">Không có tank nào</p>
      )}
    </div>
  </div>
);

// --- COMPONENT CHÍNH ---
function ListTankOilPage({ tanks, onMoveTank }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalInfo, setModalInfo] = useState({ isOpen: false, tankId: null, action: null });
  const [tempModalInfo, setTempModalInfo] = useState({ isOpen: false, tankId: null, action: null });

  const handleRequestMove = (tankId, action) => setModalInfo({ isOpen: true, tankId, action });
  const handleRequestMixing = (tankId, action) => setTempModalInfo({ isOpen: true, tankId, action });

  const handleConfirmMove = (timestamp) => {
    const { tankId, action } = modalInfo;
    onMoveTank(tankId, action.nextLocation, action.eventName, timestamp);
    setModalInfo({ isOpen: false, tankId: null, action: null });
  };

  const handleConfirmMixing = (temperature) => {
    const { tankId, action } = tempModalInfo;
    const eventNameWithTemp = `${action.eventName} (Nhiệt độ: ${temperature}°C)`;
    onMoveTank(tankId, action.nextLocation, eventNameWithTemp);
    setTempModalInfo({ isOpen: false, tankId: null, action: null });
  };

  const filteredTanks = useMemo(() =>
    tanks.filter(tank =>
      (tank.code?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (tank.sscc?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    ), [tanks, searchTerm]);

  const tanksByLocation = useMemo(() => ({
    cont20: filteredTanks.filter(t => t.location === "Cont -20"),
    cont5: filteredTanks.filter(t => t.location === "Cont -5"),
    aroma: filteredTanks.filter(t => t.location === "Aroma Room"),
    mixing: filteredTanks.filter(t => t.location === "Mixing"),
  }), [filteredTanks]);

  const getTankById = (id) => tanks.find(t => t.id === id);

  return (
    <div className="page-container kanban-layout">
      {modalInfo.isOpen && <ConfirmationModal tank={getTankById(modalInfo.tankId)} onConfirm={handleConfirmMove} onClose={() => setModalInfo({ isOpen: false, tankId: null, action: null })} />}
      {tempModalInfo.isOpen && <TemperatureModal onConfirm={handleConfirmMixing} onClose={() => setTempModalInfo({ isOpen: false, tankId: null, action: null })} />}

      <header className="main-header">
        <h1 className="header-title">Theo dõi Tank Dầu</h1>
        <div className="search-bar-container">
          <span className="material-symbols-outlined search-icon">search</span>
          <input type="text" className="search-input" placeholder="Tìm theo mã hoặc SSCC..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </header>

      <main className="kanban-board">
        <KanbanColumn title="Cont -20°C (Trữ đông)" tanks={tanksByLocation.cont20} action={{ nextLocation: "Cont -5", eventName: "Chuyển cont -5°C", icon: "arrow_forward" }} onAction={(tankId) => onMoveTank(tankId, "Cont -5", "Chuyển cont -5°C")} />
        <KanbanColumn title="Cont -5°C (Giảm đông)" tanks={tanksByLocation.cont5} action={{ nextLocation: "Aroma Room", eventName: "Lấy lên phòng Aroma", icon: "arrow_upward" }} onAction={(tankId) => handleRequestMove(tankId, { nextLocation: "Aroma Room", eventName: "Lấy lên phòng Aroma" })} />
        <KanbanColumn title="Aroma Room (Rã đông)" tanks={tanksByLocation.aroma} action={{ nextLocation: "Mixing", eventName: "Đưa vào trộn", icon: "blender" }} onAction={(tankId) => handleRequestMixing(tankId, { nextLocation: "Mixing", eventName: "Đưa vào trộn" })} />
        <KanbanColumn title="Mixing (Đang trộn)" tanks={tanksByLocation.mixing} action={{ nextLocation: "Đã trộn", eventName: "Trộn xong, hoàn thành", icon: "check_circle" }} onAction={(tankId) => onMoveTank(tankId, "Đã trộn", "Trộn xong, hoàn thành")} />
      </main>

      <Link to="/add-tank" className="fab-add-button"><span className="material-symbols-outlined">add</span></Link>
    </div>
  );
}

export default ListTankOilPage;
