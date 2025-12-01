import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx"; // THÊM
import "../assets/styles/audittrail.css";

// Hàm hỗ trợ định dạng thời gian
const formatTimestamp = (timestamp) => {
  if (!timestamp) return "N/A";
  return new Date(timestamp).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Lấy mốc thời gian mới nhất của 1 dòng (để sort)
const latestOfRow = (row) => {
  const ts = [row.cont20, row.cont5, row.aroma, row.mixing]
    .filter(Boolean)
    .map((t) => new Date(t).getTime());
  return ts.length ? Math.max(...ts) : 0;
};

// Chuẩn bị dữ liệu cho bảng
const processDataForTable = (tanks) => {
  return tanks.map((tank) => {
    const row = {
      materialCode: tank.code,
      sscc: tank.sscc,
      batch: tank.batch,
      cont20: null,
      cont5: null,
      aroma: null,
      mixing: null,
    };
    tank.history.forEach((entry) => {
      switch (entry.location) {
        case "Cont -20":
          row.cont20 = entry.timestamp;
          break;
        case "Cont -5":
          row.cont5 = entry.timestamp;
          break;
        case "Aroma Room":
          row.aroma = entry.timestamp;
          break;
        case "Mixing":
        case "Đã trộn":
          row.mixing = entry.timestamp;
          break;
        default:
          break;
      }
    });
    return row;
  });
};

function AuditTrailPage({ tanks }) {
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState("desc"); // "desc" mới → cũ | "asc" cũ → mới
  const [openSort, setOpenSort] = useState(false);

  const tableData = useMemo(() => processDataForTable(tanks), [tanks]);

  const sortedData = useMemo(() => {
    const data = [...tableData];
    data.sort((a, b) => {
      const la = latestOfRow(a);
      const lb = latestOfRow(b);
      return sortOrder === "desc" ? lb - la : la - lb;
    });
    return data;
  }, [tableData, sortOrder]);

  const handleExportExcel = () => {
    const exportRows = sortedData.map((row) => ({
      "Material Code": row.materialCode,
      SSCC: row.sscc,
      Batch: row.batch || "",
      "Cont -20°C": formatTimestamp(row.cont20),
      "Cont -5°C": formatTimestamp(row.cont5),
      "Aroma Room": formatTimestamp(row.aroma),
      Mixing: formatTimestamp(row.mixing),
    }));
    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Audit");
    const fileName = `Bao_cao_truy_xuat_${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="page-wrapper audit-page">
      <header className="audit-header">
        <button className="header-button" onClick={() => navigate(-1)}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>

        <h1 className="header-title">Báo cáo truy xuất</h1>

        <div className="header-actions">
          <div
            className="action-dropdown"
            tabIndex={0}
            onBlur={() => setOpenSort(false)}
          >
            <button
              className="icon-button"
              title="Bộ lọc sắp xếp"
              onClick={() => setOpenSort((v) => !v)}
            >
              <span className="material-symbols-outlined">filter_list</span>
            </button>
            {openSort && (
              <div className="dropdown-menu">
                <button
                  className={`menu-item ${
                    sortOrder === "desc" ? "active" : ""
                  }`}
                  onClick={() => {
                    setSortOrder("desc");
                    setOpenSort(false);
                  }}
                >
                  <span className="material-symbols-outlined">south</span>
                  Mới → Cũ
                </button>
                <button
                  className={`menu-item ${sortOrder === "asc" ? "active" : ""}`}
                  onClick={() => {
                    setSortOrder("asc");
                    setOpenSort(false);
                  }}
                >
                  <span className="material-symbols-outlined">north</span>
                  Cũ → Mới
                </button>
              </div>
            )}
          </div>

          <button
            className="export-button"
            onClick={handleExportExcel}
            title="Xuất Excel"
          >
            <span className="material-symbols-outlined">download</span>
            Xuất Excel
          </button>
        </div>
      </header>

      <main className="audit-main">
        <div className="table-container">
          <table className="audit-table">
            <thead>
              <tr>
                <th>Material Code</th>
                <th>SSCC</th>
                <th>Batch</th>
                <th>Cont -20°C</th>
                <th>Cont -5°C</th>
                <th>Aroma Room</th>
                <th>Mixing</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, index) => (
                <tr key={index}>
                  <td>{row.materialCode}</td>
                  <td>{row.sscc}</td>
                  <td>{row.batch}</td>
                  <td>{formatTimestamp(row.cont20)}</td>
                  <td>{formatTimestamp(row.cont5)}</td>
                  <td>{formatTimestamp(row.aroma)}</td>
                  <td>{formatTimestamp(row.mixing)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default AuditTrailPage;
