import React, { useState } from 'react';
import { mockAttendance } from '../../data/mockData';
import { getStatusColor } from '../../utils/helpers';

const AttendanceTracker = ({ memberId }) => {
  const [showQR, setShowQR] = useState(false);
  const records = memberId
    ? mockAttendance.filter(a => a.memberId === memberId)
    : mockAttendance;

  const todayRecords = records.filter(a => a.date === '2024-12-20');
  const presentToday = todayRecords.filter(a => a.status === 'present').length;
  const absentToday = todayRecords.filter(a => a.status === 'absent').length;

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

      {/* QR Check-In Button */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowQR(!showQR)}
          className="btn-primary flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          {showQR ? 'Hide QR Code' : 'QR Check-In'}
        </button>
        <button className="btn-secondary flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Manual Check-In
        </button>
      </div>

      {/* QR Code Display */}
      {showQR && (
        <div className="glass-card p-8 text-center animate-slide-up">
          <div className="w-48 h-48 mx-auto bg-white rounded-2xl p-4 mb-4">
            {/* Simulated QR Code */}
            <div className="w-full h-full grid grid-cols-8 grid-rows-8 gap-0.5">
              {Array.from({ length: 64 }, (_, i) => (
                <div
                  key={i}
                  className={`rounded-sm ${
                    Math.random() > 0.5 ? 'bg-dark-950' : 'bg-white'
                  }`}
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
        <div className="p-4 border-b border-white/5">
          <h3 className="font-semibold text-white">Attendance Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-xs text-dark-500 uppercase font-semibold">Member</th>
                <th className="text-left p-4 text-xs text-dark-500 uppercase font-semibold">Date</th>
                <th className="text-left p-4 text-xs text-dark-500 uppercase font-semibold">Check In</th>
                <th className="text-left p-4 text-xs text-dark-500 uppercase font-semibold">Check Out</th>
                <th className="text-left p-4 text-xs text-dark-500 uppercase font-semibold">Method</th>
                <th className="text-left p-4 text-xs text-dark-500 uppercase font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="table-row">
                  <td className="p-4 text-sm text-white">{record.memberName}</td>
                  <td className="p-4 text-sm text-dark-300">{record.date}</td>
                  <td className="p-4 text-sm text-dark-300">{record.checkIn || '—'}</td>
                  <td className="p-4 text-sm text-dark-300">{record.checkOut || '—'}</td>
                  <td className="p-4 text-sm text-dark-300">{record.method || '—'}</td>
                  <td className="p-4">
                    <span className={getStatusColor(record.status)}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;
