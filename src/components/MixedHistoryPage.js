import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
// Chúng ta sẽ sử dụng lại CSS từ trang historyoil để tiết kiệm thời gian
import '../assets/styles/historyoil.css'; 

function MixedHistoryPage({ tanks }) {
  const [searchTerm, setSearchTerm] = useState('');

  const mixedTanks = useMemo(() => {
    return tanks
      .filter(tank => tank.location === 'Đã trộn')
      .filter(tank => 
        (tank.code?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (tank.sscc?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const timeA = a.history.slice(-1)[0]?.timestamp;
        const timeB = b.history.slice(-1)[0]?.timestamp;
        return new Date(timeB) - new Date(timeA);
      });
  }, [tanks, searchTerm]);

  const getMixedTimestamp = (tank) => {
    const mixedEvent = tank.history.find(h => h.event === 'Đưa vào trộn');
    return mixedEvent ? new Date(mixedEvent.timestamp).toLocaleString('vi-VN') : 'N/A';
  };

  return (
    <div className="page-wrapper">
      <header className="history-header">
        <h1 className="header-title">Lịch sử Tank đã trộn</h1>
      </header>

      <main>
        <div className="main-content">
          <div className="search-bar-wrapper">
            <span className="material-symbols-outlined search-icon">search</span>
            <input
              className="search-input"
              placeholder="Tìm trong danh sách đã trộn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
            />
          </div>
        </div>

        <div className="transaction-list">
          {mixedTanks.length > 0 ? (
            mixedTanks.map(tank => (
              // Mỗi item là một Link đến trang chi tiết
              <Link to={`/tank/${tank.id}`} key={tank.id} className="transaction-item-link">
                <div className="transaction-item">
                  <div className="item-icon-wrapper out">
                    <span className="material-symbols-outlined">inventory</span>
                  </div>
                  <div className="item-details">
                    <p className="item-title">{tank.code}</p>
                    <p className="item-subtitle">SSCC: {tank.sscc}</p>
                  </div>
                  <div className="item-meta">
                    <p className="item-timestamp">{getMixedTimestamp(tank)}</p>
                    <span className="material-symbols-outlined">chevron_right</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
              Chưa có tank nào được đưa vào trộn.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default MixedHistoryPage;