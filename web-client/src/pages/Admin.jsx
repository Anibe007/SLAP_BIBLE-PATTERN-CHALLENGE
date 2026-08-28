import React, { useState, useEffect } from 'react';
import { dbService, DECLARATION_CATEGORIES } from '../services/db';
import { useAuth } from '../context/AuthContext';
import {
  Users, BookOpen, Flame, Globe, Shield, ShieldCheck, ShieldAlert,
  Search, Download, Trash2, CheckCircle, AlertCircle, Eye,
  Lock, Key, RefreshCw, Filter, Calendar, FileText, ChevronRight, X, Printer
} from 'lucide-react';
import AnimateOnScroll from '../components/AnimateOnScroll';
import { printOrDownloadSingleReport } from './Dashboard';

export default function Admin() {
  const { user, isAdmin, verifyAdminPasskey, refreshUser } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'reports'
  
  // Admin Key Unlock state for non-admins
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [keyError, setKeyError] = useState('');
  const [keySuccess, setKeySuccess] = useState('');
  const [keyLoading, setKeyLoading] = useState(false);

  // Search & Filters
  const [userSearch, setUserSearch] = useState('');
  const [reportSearch, setReportSearch] = useState('');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState('ALL');
  const [selectedReportModal, setSelectedReportModal] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      if (isAdmin) {
        const [metricsData, usersData, reportsData] = await Promise.all([
          dbService.getAdminMetrics(),
          dbService.getAllUsers(),
          dbService.getAllReports()
        ]);
        setMetrics(metricsData);
        setUsers(usersData);
        setReports(reportsData);
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [isAdmin]);

  const handleUnlockAdmin = async (e) => {
    e.preventDefault();
    setKeyError('');
    setKeySuccess('');
    setKeyLoading(true);
    try {
      await verifyAdminPasskey(adminKeyInput);
      setKeySuccess('Admin permission granted successfully! Loading dashboard...');
      setTimeout(() => {
        loadAdminData();
      }, 500);
    } catch (err) {
      setKeyError(err.message || 'Invalid admin passkey');
    } finally {
      setKeyLoading(false);
    }
  };

  const handleToggleAdminPermission = async (targetUser) => {
    const isTargetAdmin = targetUser.isAdmin || targetUser.is_admin || targetUser.role === 'admin';
    const action = isTargetAdmin ? 'Revoke admin access from' : 'Grant admin access to';
    if (!window.confirm(`Are you sure you want to ${action} ${targetUser.fullName || targetUser.user_metadata?.full_name || targetUser.email}?`)) {
      return;
    }

    try {
      if (isTargetAdmin) {
        await dbService.revokeAdminPermission(targetUser.id);
        setActionMessage(`Revoked admin permissions for ${targetUser.fullName || targetUser.email}`);
      } else {
        await dbService.grantAdminPermission(targetUser.id);
        setActionMessage(`Granted admin permissions to ${targetUser.fullName || targetUser.email}`);
      }
      await refreshUser();
      loadAdminData();
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) return;
    try {
      await dbService.deleteReportByAdmin(reportId);
      setActionMessage("Submission deleted successfully");
      loadAdminData();
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  const exportReportsToCSV = () => {
    if (reports.length === 0) return alert("No reports available to export.");
    const headers = ["Participant Name", "Email", "Country", "Book", "Chapter", "Verses", "Translation", "Striking Verses", "Lessons Learnt", "Action Plans", "Prayers", "Date"];
    const rows = reports.map(r => [
      `"${r.userName || ''}"`,
      `"${r.userEmail || ''}"`,
      `"${r.userCountry || ''}"`,
      `"${r.book || ''}"`,
      `"${r.chapter || ''}"`,
      `"${r.verses || ''}"`,
      `"${r.translation || ''}"`,
      `"${(r.striking_verses || r.strikingVerses || '').replace(/"/g, '""')}"`,
      `"${(r.lessons_learnt || r.lessonsLearnt || '').replace(/"/g, '""')}"`,
      `"${(r.action_plans || r.actionPlans || '').replace(/"/g, '""')}"`,
      `"${(r.prayers || '').replace(/"/g, '""')}"`,
      `"${r.submission_date || r.created_at || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SLAP_Global_Submissions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered participants
  const filteredUsers = users.filter(u => {
    const name = (u.fullName || u.user_metadata?.full_name || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const country = (u.country || u.user_metadata?.country || '').toLowerCase();
    const matchesSearch = name.includes(userSearch.toLowerCase()) || email.includes(userSearch.toLowerCase()) || country.includes(userSearch.toLowerCase());
    const matchesCountry = selectedCountryFilter === 'ALL' || (u.country || u.user_metadata?.country) === selectedCountryFilter;
    return matchesSearch && matchesCountry;
  });

  // Filtered reports
  const filteredReports = reports.filter(r => {
    const search = reportSearch.toLowerCase();
    const userMatch = (r.userName || '').toLowerCase().includes(search);
    const bookMatch = (r.book || '').toLowerCase().includes(search);
    const textMatch = (r.striking_verses || r.strikingVerses || '').toLowerCase().includes(search);
    return userMatch || bookMatch || textMatch;
  });

  const allCountries = Array.from(new Set(users.map(u => u.country || u.user_metadata?.country).filter(Boolean)));

  // If not authorized as admin, display Admin Access Permission Gate
  if (!isAdmin) {
    return (
      <div className="section-container" style={{ maxWidth: '580px', margin: '40px auto', padding: '0 20px' }}>
        <AnimateOnScroll animation="fadeIn">
          <div className="glass-card" style={{ padding: '36px', textAlign: 'center', border: '1px solid var(--accent-gold)' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(212, 160, 23, 0.15)', color: 'var(--accent-gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <ShieldAlert size={32} />
            </div>

            <h2 style={{ fontSize: '26px', color: 'var(--text-primary)', margin: '0 0 10px' }}>
              Authorized Admin Access Only
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>
              The SLAP Bible Admin Dashboard is restricted. Only authorized administrators who have been granted permission by the platform administrator can monitor participants and manage daily submissions.
            </p>

            {keyError && (
              <div className="alert alert-error" style={{ marginBottom: '16px', textAlign: 'left' }}>
                <AlertCircle size={16} /> {keyError}
              </div>
            )}

            {keySuccess && (
              <div className="alert alert-success" style={{ marginBottom: '16px', textAlign: 'left' }}>
                <CheckCircle size={16} /> {keySuccess}
              </div>
            )}

            <form onSubmit={handleUnlockAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group" style={{ textAlign: 'left', margin: 0 }}>
                <label className="text-label-sm">Enter Admin Authorization Passkey</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    placeholder="Enter confidential administrator passkey"
                    value={adminKeyInput}
                    onChange={e => setAdminKeyInput(e.target.value)}
                    required
                    style={{ paddingLeft: '38px', fontSize: '15px' }}
                  />
                  <Key size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--accent-gold)' }} />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={keyLoading}
                style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <ShieldCheck size={18} /> {keyLoading ? 'Verifying Permission...' : 'Authorize Admin Dashboard'}
              </button>
            </form>
          </div>
        </AnimateOnScroll>
      </div>
    );
  }

  return (
    <div className="section-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 60px' }}>
      
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent-gold)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <ShieldCheck size={16} /> Lead Administrator: David Anibe Daniel
          </div>
          <h1 style={{ fontSize: '32px', margin: '6px 0 4px', color: 'var(--text-primary)' }}>
            Admin Dashboard
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
            Monitor all participant records, oversee daily SLAP submissions, and manage system permissions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={loadAdminData}
            className="btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '10px 16px' }}
            title="Refresh records"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh Data
          </button>

          <button
            onClick={exportReportsToCSV}
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '10px 16px', background: 'var(--accent-gold)', color: '#1a1409' }}
            title="Export all submissions to spreadsheet"
          >
            <Download size={15} /> Export All Submissions (CSV)
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="alert alert-success" style={{ marginBottom: '20px' }}>
          <CheckCircle size={16} /> {actionMessage}
        </div>
      )}

      {/* KPI Overview Metrics */}
      <div className="stats-grid" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(212, 160, 23, 0.15)', color: 'var(--accent-gold)' }}>
            <Users size={24} />
          </div>
          <div className="stat-value">{metrics?.totalParticipants || users.length}</div>
          <div className="stat-label">Total Participants</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <BookOpen size={24} />
          </div>
          <div className="stat-value">{metrics?.todaySubmissions || 0}</div>
          <div className="stat-label">Today's Daily Entries</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' }}>
            <Flame size={24} />
          </div>
          <div className="stat-value">{metrics?.totalSubmissions || reports.length}</div>
          <div className="stat-label">Total SLAP Submissions</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
            <Globe size={24} />
          </div>
          <div className="stat-value">{metrics?.nationsReached || allCountries.length}</div>
          <div className="stat-label">Nations Reached</div>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="tab-switcher" style={{ marginBottom: '24px' }}>
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Users size={16} /> Participants Records ({users.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <BookOpen size={16} /> All Daily Submissions ({reports.length})
        </button>
      </div>

      {/* ═══════════ TAB: PARTICIPANTS MANAGEMENT ═══════════ */}
      {activeTab === 'overview' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '20px' }}>Participant Records &amp; Permissions</h2>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                View details for every registered believer and grant/revoke admin permissions.
              </p>
            </div>

            {/* Search & Country Filter */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', width: '240px' }}>
                <input
                  type="text"
                  placeholder="Search participants..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  style={{ paddingLeft: '34px', fontSize: '13px' }}
                />
                <Search size={14} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-secondary)' }} />
              </div>

              <select
                value={selectedCountryFilter}
                onChange={e => setSelectedCountryFilter(e.target.value)}
                style={{ width: '160px', fontSize: '13px' }}
              >
                <option value="ALL">All Nations</option>
                {allCountries.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Participants Table */}
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  <th style={{ padding: '12px 14px' }}>Participant</th>
                  <th style={{ padding: '12px 14px' }}>Nation</th>
                  <th style={{ padding: '12px 14px' }}>Submissions</th>
                  <th style={{ padding: '12px 14px' }}>Current Streak</th>
                  <th style={{ padding: '12px 14px' }}>Role</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Admin Permission</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      No participants found matching your query.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isUserAdmin = u.isAdmin || u.is_admin || u.role === 'admin';
                    return (
                      <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '13px' }}>
                        <td style={{ padding: '14px' }}>
                          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                            {u.fullName || u.user_metadata?.full_name || 'Participant'}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{u.email}</div>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Globe size={13} style={{ color: 'var(--accent-gold)' }} /> {u.country || u.user_metadata?.country || 'Global'}
                          </span>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span className="badge-pill" style={{ background: 'rgba(212, 160, 23, 0.12)', color: 'var(--accent-gold)' }}>
                            {u.totalSubmissions || 0} entries
                          </span>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#f43f5e', fontWeight: '600' }}>
                            <Flame size={14} /> {u.current_streak || 0} days
                          </span>
                        </td>
                        <td style={{ padding: '14px' }}>
                          {isUserAdmin ? (
                            <span className="badge-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <ShieldCheck size={12} /> Administrator
                            </span>
                          ) : (
                            <span className="badge-pill" style={{ background: 'rgba(255, 255, 255, 0.06)', color: 'var(--text-secondary)' }}>
                              Participant
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '14px', textAlign: 'right' }}>
                          <button
                            onClick={() => handleToggleAdminPermission(u)}
                            className="btn-secondary"
                            style={{
                              padding: '6px 12px',
                              fontSize: '12px',
                              color: isUserAdmin ? '#f43f5e' : 'var(--accent-gold)',
                              borderColor: isUserAdmin ? '#f43f5e' : 'var(--accent-gold)'
                            }}
                            title={isUserAdmin ? 'Revoke admin access' : 'Grant admin access'}
                          >
                            {isUserAdmin ? 'Revoke Admin' : 'Grant Admin'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════ TAB: ALL DAILY SUBMISSIONS ═══════════ */}
      {activeTab === 'reports' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '20px' }}>All Daily Submissions Stream</h2>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                Review, inspect, and export daily SLAP study entries submitted across all participants.
              </p>
            </div>

            <div style={{ position: 'relative', width: '280px' }}>
              <input
                type="text"
                placeholder="Search scripture or participant..."
                value={reportSearch}
                onChange={e => setReportSearch(e.target.value)}
                style={{ paddingLeft: '34px', fontSize: '13px' }}
              />
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-secondary)' }} />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  <th style={{ padding: '12px 14px' }}>Date</th>
                  <th style={{ padding: '12px 14px' }}>Participant</th>
                  <th style={{ padding: '12px 14px' }}>Scripture Reading</th>
                  <th style={{ padding: '12px 14px' }}>Striking Verse Extract</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      No submissions found.
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((r) => (
                    <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '13px' }}>
                      <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                          <Calendar size={13} /> {new Date(r.submission_date || r.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{r.userName || 'Participant'}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{r.userEmail} {r.userCountry ? `(${r.userCountry})` : ''}</div>
                      </td>
                      <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                        <span style={{ fontWeight: '600', color: 'var(--accent-gold)' }}>
                          {r.book} {r.chapter}{r.verses ? `:${r.verses}` : ''}
                        </span>
                        <span style={{ fontSize: '11px', opacity: 0.7, marginLeft: '4px' }}>({r.translation || 'KJV'})</span>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontStyle: 'italic' }}>
                          "{r.striking_verses || r.strikingVerses || 'No striking verses entered'}"
                        </div>
                      </td>
                      <td style={{ padding: '14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => setSelectedReportModal(r)}
                            className="btn-secondary"
                            style={{ padding: '5px 10px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            title="Inspect full SLAP entry"
                          >
                            <Eye size={12} /> Inspect
                          </button>
                          <button
                            onClick={() => printOrDownloadSingleReport(r, { fullName: r.userName, email: r.userEmail })}
                            className="btn-primary"
                            style={{ padding: '5px 10px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'var(--accent-gold)', color: '#1a1409' }}
                            title="Generate and download document"
                          >
                            <Printer size={12} /> Doc
                          </button>
                          <button
                            onClick={() => handleDeleteReport(r.id)}
                            style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '4px', padding: '5px 8px', cursor: 'pointer' }}
                            title="Delete submission"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════ INSPECT REPORT MODAL ═══════════ */}
      {selectedReportModal && (
        <div className="drawer-backdrop open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1100 }}>
          <div className="glass-card" style={{ maxWidth: '680px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', border: '1px solid var(--accent-gold)', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
            <button
              onClick={() => setSelectedReportModal(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
            >
              <X size={22} />
            </button>

            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                <ShieldCheck size={16} /> Admin Report Inspection
              </div>
              <h2 style={{ fontSize: '24px', margin: '6px 0 2px', color: 'var(--text-primary)' }}>
                {selectedReportModal.book} {selectedReportModal.chapter}{selectedReportModal.verses ? `:${selectedReportModal.verses}` : ''}
              </h2>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <span><strong>Participant:</strong> {selectedReportModal.userName} ({selectedReportModal.userEmail})</span>
                <span><strong>Nation:</strong> {selectedReportModal.userCountry || 'Global'}</span>
                <span><strong>Date:</strong> {new Date(selectedReportModal.submission_date || selectedReportModal.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: 'rgba(212, 160, 23, 0.08)', borderLeft: '4px solid var(--accent-gold)', padding: '12px 16px', borderRadius: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-gold)' }}>[S] Striking Verses</span>
                <p style={{ margin: '4px 0 0', fontSize: '14px', fontStyle: 'italic' }}>"{selectedReportModal.striking_verses || selectedReportModal.strikingVerses || 'None'}"</p>
              </div>

              <div style={{ background: 'rgba(92, 74, 50, 0.1)', borderLeft: '4px solid var(--accent-brown)', padding: '12px 16px', borderRadius: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-brown)' }}>[L] Lessons Learnt</span>
                <p style={{ margin: '4px 0 0', fontSize: '14px' }}>{selectedReportModal.lessons_learnt || selectedReportModal.lessonsLearnt || 'None'}</p>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.08)', borderLeft: '4px solid #10b981', padding: '12px 16px', borderRadius: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#10b981' }}>[A] Action Plans</span>
                <p style={{ margin: '4px 0 0', fontSize: '14px' }}>{selectedReportModal.action_plans || selectedReportModal.actionPlans || 'None'}</p>
              </div>

              <div style={{ background: 'rgba(244, 63, 94, 0.08)', borderLeft: '4px solid #f43f5e', padding: '12px 16px', borderRadius: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#f43f5e' }}>[P] Prayers</span>
                <p style={{ margin: '4px 0 0', fontSize: '14px' }}>{selectedReportModal.prayers || 'None'}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <button
                className="btn-primary"
                onClick={() => printOrDownloadSingleReport(selectedReportModal, { fullName: selectedReportModal.userName, email: selectedReportModal.userEmail })}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', background: 'var(--accent-gold)', color: '#1a1409' }}
              >
                <Printer size={15} /> Download / Print Report
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
