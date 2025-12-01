import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/thongke.css";

// Hằng số thời gian chờ theo quy trình
const DURATION = {
  CONT5_MS: 24 * 60 * 60 * 1000, // 24h
  AROMA_MS: 30 * 60 * 60 * 1000, // 30h
  OVERDUE_GRACE_MS: 4 * 60 * 60 * 1000, // +4h coi là trễ
};

// HÀM ĐỊNH DẠNG SỐ AN TOÀN
const fmt = (n) => {
  const value = Number.isFinite(n) ? n : Number(n ?? 0) || 0;
  return value.toLocaleString("vi-VN");
};

// THÊM: map status -> class CSS (và fallback)
const getStatusClassName = (status) => {
  switch ((status || "").toLowerCase()) {
    case "ok":
    case "ready":
      return "ok";
    case "warning":
    case "low":
      return "low";
    case "error":
    case "critical":
      return "critical";
    default:
      return "neutral";
  }
};

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const asTime = (ts) => (ts ? new Date(ts) : null);

const lastHistoryAt = (tank, location) => {
  if (!tank?.history) return null;
  for (let i = tank.history.length - 1; i >= 0; i--) {
    const h = tank.history[i];
    if (h.location === location) return asTime(h.timestamp);
  }
  return null;
};

const readyInfo = (tank) => {
  const now = Date.now();
  if (tank.location === "Cont -5") {
    const ts = lastHistoryAt(tank, "Cont -5");
    if (!ts)
      return {
        ready: false,
        overdue: false,
        elapsedMs: 0,
        needMs: DURATION.CONT5_MS,
      };
    const elapsed = now - ts.getTime();
    return {
      ready: elapsed >= DURATION.CONT5_MS,
      overdue: elapsed >= DURATION.CONT5_MS + DURATION.OVERDUE_GRACE_MS,
      elapsedMs: elapsed,
      needMs: DURATION.CONT5_MS,
    };
  }
  if (tank.location === "Aroma Room") {
    const ts = lastHistoryAt(tank, "Aroma Room");
    if (!ts)
      return {
        ready: false,
        overdue: false,
        elapsedMs: 0,
        needMs: DURATION.AROMA_MS,
      };
    const elapsed = now - ts.getTime();
    return {
      ready: elapsed >= DURATION.AROMA_MS,
      overdue: elapsed >= DURATION.AROMA_MS + DURATION.OVERDUE_GRACE_MS,
      elapsedMs: elapsed,
      needMs: DURATION.AROMA_MS,
    };
  }
  return { ready: false, overdue: false, elapsedMs: 0, needMs: 0 };
};

function ThongKePage({ tanks = [] }) {
  // đảm bảo tanks luôn là mảng
  const navigate = useNavigate();

  // Phân bố theo vị trí
  const byStage = useMemo(() => {
    const map = {
      "Cont -20": 0,
      "Cont -5": 0,
      "Aroma Room": 0,
      Mixing: 0,
      "Đã trộn": 0,
    };
    tanks.forEach((t) => {
      if (map[t.location] !== undefined) map[t.location]++;
    });
    return map;
  }, [tanks]);

  // Sẵn sàng & Trễ
  const { readyCount, overdueCount, overdueList } = useMemo(() => {
    let ready = 0,
      overdue = 0;
    const list = [];
    tanks.forEach((t) => {
      const info = readyInfo(t);
      if (
        info.ready &&
        (t.location === "Cont -5" || t.location === "Aroma Room")
      )
        ready++;
      if (info.overdue) {
        list.push({
          id: t.id,
          code: t.code,
          sscc: t.sscc,
          location: t.location,
          hours: Math.floor(info.elapsedMs / 36e5),
        });
        overdue++;
      }
    });
    // ưu tiên những cái quá hạn nhiều giờ
    list.sort((a, b) => b.hours - a.hours);
    return {
      readyCount: ready,
      overdueCount: overdue,
      overdueList: list.slice(0, 8),
    };
  }, [tanks]);

  // Số đã trộn hôm nay + 7 ngày gần nhất (trend)
  const trend = useMemo(() => {
    const today = startOfDay(new Date());
    const days = [...Array(7)].map(
      (_, i) => new Date(today.getTime() - (6 - i) * 86400000)
    );
    const bucket = days.map((d) => ({ date: d, count: 0 }));
    let mixedToday = 0;

    tanks.forEach((t) => {
      const mixedTs = lastHistoryAt(t, "Đã trộn") || lastHistoryAt(t, "Mixing"); // fallback nếu quy trình lưu "Mixing"
      if (!mixedTs) return;
      const sod = startOfDay(mixedTs);
      // hôm nay
      if (sod.getTime() === today.getTime()) mixedToday++;
      // 7 ngày
      bucket.forEach((b) => {
        if (sod.getTime() === b.date.getTime()) b.count++;
      });
    });

    const max = Math.max(1, ...bucket.map((b) => b.count));
    return {
      mixedToday,
      series: bucket,
      max,
    };
  }, [tanks]);

  // Lead time TB từ Cont -20 -> Đã trộn
  const avgLeadHours = useMemo(() => {
    let total = 0,
      n = 0;
    tanks.forEach((t) => {
      const s = lastHistoryAt(t, "Cont -20");
      const e = lastHistoryAt(t, "Đã trộn") || lastHistoryAt(t, "Mixing");
      if (s && e && e > s) {
        total += (e.getTime() - s.getTime()) / 36e5;
        n++;
      }
    });
    return n ? Math.round((total / n) * 10) / 10 : 0;
  }, [tanks]);

  const total = tanks.length;

  return (
    <div className="page-wrapper">
      <header className="report-header">
        <button className="header-button" onClick={() => navigate(-1)}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="header-title">Báo Cáo & Thống Kê</h1>
        <button className="header-button" title="Tải ảnh dashboard">
          <span className="material-symbols-outlined">download</span>
        </button>
      </header>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-card-title">Tổng số tank đang quản lý</p>
          <p className="stat-card-value">{fmt(total)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card-title">Tank sẵn sàng di chuyển</p>
          <p className="stat-card-value">{fmt(readyCount)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card-title">Đã trộn hôm nay</p>
          <p className="stat-card-value">{fmt(trend.mixedToday)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card-title">Lead time TB (giờ)</p>
          <p className="stat-card-value">{avgLeadHours}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="content-section">
        {/* Phân bố theo giai đoạn */}
        <div className="chart-card">
          <p className="chart-card-title">Phân bố theo giai đoạn</p>
          <div className="bar-chart-grid">
            {[
              { label: "Cont -20°C", value: byStage["Cont -20"] },
              { label: "Cont -5°C", value: byStage["Cont -5"] },
              { label: "Aroma", value: byStage["Aroma Room"] },
              { label: "Mixing", value: byStage["Mixing"] },
              { label: "Đã trộn", value: byStage["Đã trộn"] },
            ].map((b, i) => {
              // chiều cao cột dựa trên max trong nhóm
              const max = Math.max(1, ...Object.values(byStage));
              const height = Math.round((b.value / max) * 100);
              return (
                <div key={i} className="bar-chart-item">
                  <div
                    className="bar-chart-bar"
                    style={{ height: `${height}%` }}
                  />
                  <p className="bar-chart-label">{b.label}</p>
                  <p className="bar-chart-label" style={{ fontWeight: 700 }}>
                    {b.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Xu hướng 7 ngày */}
        <div className="chart-card">
          <p className="chart-card-title">Xu hướng “Đã trộn” 7 ngày</p>
          <div
            className="bar-chart-grid"
            style={{ gridAutoFlow: "column", gap: "0.75rem" }}
          >
            {trend.series.map((d, i) => {
              const h = Math.round((d.count / trend.max) * 100);
              const label = d.date.toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
              });
              return (
                <div key={i} className="bar-chart-item">
                  <div className="bar-chart-bar" style={{ height: `${h}%` }} />
                  <p className="bar-chart-label">{label}</p>
                  <p className="bar-chart-label" style={{ fontWeight: 700 }}>
                    {d.count}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Danh sách tank chi tiết */}
      <h2 className="section-header">Chi tiết các tank</h2>
      <div className="tank-list">
        {tanks.map((tank, index) => {
          const level =
            Number.isFinite(tank.level) ? tank.level : Number(tank.level ?? 0) || 0;
          const capacity =
            Number.isFinite(tank.capacity)
              ? tank.capacity
              : Number(tank.capacity ?? 0) || 0;

          return (
            <div key={index} className="tank-item">
              <div className="tank-icon-wrapper">
                <span className="material-symbols-outlined">oil_barrel</span>
              </div>
              <div className="tank-details">
                <p className="tank-title">{tank.code}</p>
                <p className="tank-subtitle">{tank.location || "N/A"}</p>
              </div>
              <div className="tank-status">
                <p className="tank-level">
                  {capacity ? `${fmt(level)} / ${fmt(capacity)}` : "N/A"}
                </p>
                <span className={`status-badge ${getStatusClassName(tank.status)}`}>
                  {tank.status || "—"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ThongKePage;
