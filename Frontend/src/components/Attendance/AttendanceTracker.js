import { useState, useEffect } from 'react';
import { attendanceService } from '../../services/api';
import { getStatusColor } from '../../utils/helpers';

const AttendanceTracker = ({ memberId }) => {
  const [showQR, setShowQR] = useState(false);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch attendance records
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await attendanceService.getMyAttendance();
      setRecords(res.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError('Failed to load attendance records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayRecord = records.find(r => r.date === today);
  const isCheckedIn = todayRecord && todayRecord.checkIn && !todayRecord.checkOut;

  const handleManualAction = async () => {
    try {
      setActionLoading(true);
      if (isCheckedIn) {
        await attendanceService.checkOut();
      } else {
        await attendanceService.checkIn({ method: 'Manual' });
      }
      await fetchRecords(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const presentToday = records.filter(a => a.date === today && a.status === 'present').length;
  const absentToday = records.filter(a => a.date === today && a.status === 'absent').length;

  if (loading && records.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold text-white">{records.length}</p>
          <p className="text-dark-400 text-sm">Total Records</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold text-emerald-400">{presentToday}</p>
          <p className="text-dark-400 text-sm">Present Today</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold text-red-400">{absentToday}</p>
          <p className="text-dark-400 text-sm">Absent Today</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setShowQR(!showQR)}
          className="btn-primary flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          {showQR ? 'Hide QR Code' : 'QR Check-In'}
        </button>
        <button
          onClick={handleManualAction}
          disabled={actionLoading}
          className={`${isCheckedIn ? 'bg-red-500 hover:bg-red-600' : 'btn-secondary'} flex items-center gap-2 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50`}
        >
          {actionLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          )}
          {isCheckedIn ? 'Manual Clock Out' : 'Manual Clock In'}
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* QR Code Display */}
      {showQR && (
        <div className="glass-card p-8 text-center animate-slide-up">
          <div className="w-48 h-48 mx-auto bg-white rounded-2xl p-4 mb-4">
            <div className="w-full h-full grid grid-cols-8 grid-rows-8 gap-0.5">
              {Array.from({ length: 64 }, (_, i) => (
                <div
                  key={i}
                  className={`rounded-sm ${Math.random() > 0.5 ? 'bg-dark-950' : 'bg-white'}`}
                ></div>
              ))}
            </div>
          </div>
          <p className="text-white font-medium">Scan to Check In</p>
          <p className="text-dark-400 text-sm mt-1">Present this QR code at the entrance</p>
        </div>
      )}

      {/* Attendance Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-semibold text-white">Attendance Records</h3>
          <button onClick={fetchRecords} className="text-primary-400 text-xs hover:underline">Refresh</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="p-4 text-xs text-dark-500 uppercase font-semibold">Date</th>
                <th className="p-4 text-xs text-dark-500 uppercase font-semibold">Check In</th>
                <th className="p-4 text-xs text-dark-500 uppercase font-semibold">Check Out</th>
                <th className="p-4 text-xs text-dark-500 uppercase font-semibold">Method</th>
                <th className="p-4 text-xs text-dark-500 uppercase font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-dark-400 italic">No attendance records found.</td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record._id} className="table-row">
                    <td className="p-4 text-sm text-dark-300 font-mono">{record.date}</td>
                    <td className="p-4 text-sm text-white font-semibold">{record.checkIn || '—'}</td>
                    <td className="p-4 text-sm text-white font-semibold">{record.checkOut || '—'}</td>
                    <td className="p-4 text-sm">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${record.method === 'QR Code' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
                        }`}>
                        {record.method || 'Manual'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={getStatusColor(record.status)}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;



