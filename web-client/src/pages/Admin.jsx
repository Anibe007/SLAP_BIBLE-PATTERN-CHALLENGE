import React, { useState, useEffect } from 'react';
import { dbService, DECLARATION_CATEGORIES } from '../services/db';
import { isSupabaseConfigured } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import {
  Users, BookOpen, Flame, Globe, Shield, ShieldCheck, ShieldAlert,
  Search, Download, Trash2, CheckCircle, AlertCircle, Eye,
  Lock, Key, RefreshCw, Filter, Calendar, FileText, ChevronRight, X, Printer,
  TrendingUp, Activity, Award, Clock, Zap
} from 'lucide-react';
import AnimateOnScroll from '../components/AnimateOnScroll';
import { printOrDownloadSingleReport } from './Dashboard';

export default function Admin() {
  const { user, isAdmin, verifyAdminPasskey, refreshUser } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'reports', 'consistency'
  const [consistencySort, setConsistencySort] = useState('streak'); // 'streak' | 'submissions' | 'rate' | 'name'
  
  // Admin Key Unlock state for non-admins
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [showPasskey, setShowPasskey] = useState(false);
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

  const handleDeleteParticipant = async (targetUser) => {
    const pName = targetUser.fullName || targetUser.full_name || targetUser.user_metadata?.full_name || targetUser.email;
    if (!window.confirm(`⚠️ ARE YOU SURE you want to delete participant "${pName}" (${targetUser.email})?\n\nThis action will permanently delete their account record, study logs, and streak metrics.`)) {
      return;
    }

    try {
      await dbService.deleteParticipantByAdmin(targetUser.email, targetUser.id);
      setActionMessage(`Participant "${pName}" has been successfully deleted.`);
      loadAdminData();
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err) {
      alert(err.message || "Failed to delete participant");
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
              width: '68px', height: '68px', borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(212, 160, 23, 0.25), rgba(184, 134, 11, 0.15))',
              color: 'var(--accent-gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              border: '2px solid rgba(212, 160, 23, 0.4)',
              boxShadow: '0 8px 24px rgba(212, 160, 23, 0.2)'
            }}>
              <ShieldAlert size={36} />
            </div>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px',
              color: 'var(--accent-gold)', background: 'rgba(212, 160, 23, 0.12)',
              padding: '4px 14px', borderRadius: '20px', marginBottom: '14px',
              border: '1px solid rgba(212, 160, 23, 0.3)'
            }}>
              <Lock size={13} /> High-Security Admin Portal
            </div>

            <h2 style={{ fontSize: '26px', color: 'var(--text-primary)', margin: '0 0 10px' }}>
              Authorized Admin Passkey Required
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>
              Access to participant study logs, streak records, and system administration is restricted to authorized personnel with a valid passkey.
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

            <form onSubmit={handleUnlockAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ textAlign: 'left', margin: 0 }}>
                <label className="text-label-sm" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Admin Passkey</span>
                  <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: '700' }}>Confidential</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPasskey ? "text" : "password"}
                    placeholder="Enter confidential passkey (e.g. SLAP_ADMIN_2026)"
                    value={adminKeyInput}
                    onChange={e => setAdminKeyInput(e.target.value)}
                    required
                    style={{ paddingLeft: '38px', paddingRight: '42px', fontSize: '15px' }}
                  />
                  <Key size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--accent-gold)' }} />
                  <button
                    type="button"
                    onClick={() => setShowPasskey(!showPasskey)}
                    style={{
                      position: 'absolute', right: '12px', top: '12px',
                      background: 'none', border: 'none', color: 'var(--text-secondary)',
                      cursor: 'pointer', padding: '2px'
                    }}
                    title={showPasskey ? "Hide passkey" : "Show passkey"}
                  >
                    {showPasskey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={keyLoading}
                style={{
                  padding: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '15px',
                  fontWeight: '700',
                  background: 'var(--accent-gold)',
                  color: '#1a1409'
                }}
              >
                <ShieldCheck size={18} /> {keyLoading ? 'Verifying Admin Passkey...' : 'Authorize Admin Dashboard'}
              </button>
            </form>

            <div style={{
              marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)',
              fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
            }}>
              <span>Default Administrator Passkey:</span>
              <code style={{
                background: 'rgba(212, 160, 23, 0.15)',
                color: 'var(--accent-gold)',
                padding: '2px 8px',
                borderRadius: '4px',
                fontWeight: '700',
                fontSize: '12px'
              }}>SLAP_ADMIN_2026</code>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    );
  }

  // ─── Derive admin display info ───
  const adminDisplayName = user?.fullName || user?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Administrator';
  const adminAvatarUrl   = user?.avatar_url || user?.user_metadata?.avatar_url || null;
  const adminEmail       = user?.email || '';
  const adminInitials    = adminDisplayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="section-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 60px' }}>
      
      {/* ─── Personalized Admin Header Banner ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        {/* Admin Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {adminAvatarUrl ? (
              <img
                src={adminAvatarUrl}
                alt={adminDisplayName}
                style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid var(--accent-gold)',
                  boxShadow: '0 0 0 4px rgba(212,160,23,0.18)'
                }}
                onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
              />
            ) : null}
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-gold), #92400e)',
              display: adminAvatarUrl ? 'none' : 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', fontWeight: '800', color: '#1a1409',
              border: '3px solid var(--accent-gold)',
              boxShadow: '0 0 0 4px rgba(212,160,23,0.18)'
            }}>
              {adminInitials}
            </div>
            {/* Online dot */}
            <div style={{
              width: '13px', height: '13px', borderRadius: '50%', background: '#22c55e',
              position: 'absolute', bottom: '2px', right: '2px',
              border: '2px solid var(--bg-primary)'
            }} />
          </div>

          {/* Name & Role */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent-gold)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
              <ShieldCheck size={14} /> Administrator
            </div>
            <h1 style={{ fontSize: '28px', margin: '0 0 4px', color: 'var(--text-primary)' }}>
              {adminDisplayName}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {adminEmail && (
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{adminEmail}</span>
              )}
              <span style={{
                fontSize: '12px', fontWeight: '700', color: 'var(--accent-gold)',
                background: 'rgba(212,160,23,0.12)', padding: '2px 10px', borderRadius: '20px'
              }}>⚙️ Admin Dashboard</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
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

      {/* Database Mode Status Banner */}
      {!isSupabaseConfigured ? (
        <div style={{
          background: 'rgba(234, 179, 8, 0.1)',
          border: '1px solid rgba(234, 179, 8, 0.3)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'rgba(234, 179, 8, 0.2)', color: '#eab308',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <AlertCircle size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '2px' }}>
              ⚠️ Local Device Demo Mode Active
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Participants on other devices or networks cannot be seen on this dashboard because Supabase cloud keys are not yet configured. To connect all devices globally, create a <code>.env</code> file inside <code>web-client/</code> with your Supabase URL &amp; Anon Key.
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '12px',
          padding: '14px 20px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.2)', color: '#10b981',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <CheckCircle size={20} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#10b981' }}>
              🌐 Supabase Multi-Device Cloud Sync Active
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Live cloud database connected. Registrations and daily SLAP devotions from participants across all devices and networks are synced here in real-time.
            </div>
          </div>
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
        <button
          className={`tab-btn ${activeTab === 'consistency' ? 'active' : ''}`}
          onClick={() => setActiveTab('consistency')}
        >
          <TrendingUp size={16} /> Consistency Tracker
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
                  <th style={{ padding: '12px 14px' }}>Total Logins</th>
                  <th style={{ padding: '12px 14px' }}>Submissions</th>
                  <th style={{ padding: '12px 14px' }}>Current Streak</th>
                  <th style={{ padding: '12px 14px' }}>Role</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Admin Permission</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
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
                          <span className="badge-pill" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6', fontWeight: '700' }}>
                            <Key size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} />
                            {u.totalLogins || u.loginCount || 1} logins
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
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
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

                            <button
                              onClick={() => handleDeleteParticipant(u)}
                              className="btn-secondary"
                              style={{
                                padding: '6px 10px',
                                fontSize: '12px',
                                color: '#ef4444',
                                borderColor: '#ef4444',
                                background: 'rgba(239, 68, 68, 0.1)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              title={`Delete participant ${u.email}`}
                            >
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
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

      {/* ═══════════ TAB: CONSISTENCY TRACKER ═══════════ */}
      {activeTab === 'consistency' && (() => {
        const todayMs = Date.now();

        // Compute a simple consistency rate: submissions / days since created_at (capped at 100%)
        const withRates = users.map(u => {
          const createdMs = u.created_at ? new Date(u.created_at).getTime() : todayMs;
          const daysSinceJoined = Math.max(1, Math.round((todayMs - createdMs) / 86400000));
          const rate = Math.min(100, Math.round(((u.totalSubmissions || 0) / daysSinceJoined) * 100));

          // Activity status
          let status = 'inactive';
          if (u.last_activity_date) {
            const daysSinceActive = Math.round((todayMs - new Date(u.last_activity_date).getTime()) / 86400000);
            if (daysSinceActive <= 1) status = 'active';
            else if (daysSinceActive <= 7) status = 'at-risk';
          } else if ((u.current_streak || 0) > 0) {
            status = 'at-risk';
          }

          return { ...u, consistencyRate: rate, status };
        });

        const sorted = [...withRates].sort((a, b) => {
          if (consistencySort === 'streak') return (b.current_streak || 0) - (a.current_streak || 0);
          if (consistencySort === 'submissions') return (b.totalSubmissions || 0) - (a.totalSubmissions || 0);
          if (consistencySort === 'rate') return (b.consistencyRate || 0) - (a.consistencyRate || 0);
          if (consistencySort === 'name') return (a.full_name || a.fullName || '').localeCompare(b.full_name || b.fullName || '');
          return 0;
        });

        const maxStreak = Math.max(...sorted.map(u => u.longest_streak || 0), 1);
        const activeCount = sorted.filter(u => u.status === 'active').length;
        const atRiskCount = sorted.filter(u => u.status === 'at-risk').length;
        const inactiveCount = sorted.filter(u => u.status === 'inactive').length;

        const statusStyle = {
          active:   { bg: 'rgba(16,185,129,0.15)',  color: '#10b981', label: '🟢 Active',   border: 'rgba(16,185,129,0.35)' },
          'at-risk':{ bg: 'rgba(234,179,8,0.15)',   color: '#eab308', label: '🟡 At Risk',  border: 'rgba(234,179,8,0.35)' },
          inactive: { bg: 'rgba(244,63,94,0.12)',   color: '#f43f5e', label: '🔴 Inactive', border: 'rgba(244,63,94,0.3)' }
        };

        return (
          <div>
            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '28px' }}>
              <div className="glass-card" style={{ padding: '18px 20px', borderLeft: '3px solid #10b981', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#10b981' }}>{activeCount}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: '600' }}>🟢 Active (last 24h)</div>
              </div>
              <div className="glass-card" style={{ padding: '18px 20px', borderLeft: '3px solid #eab308', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#eab308' }}>{atRiskCount}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: '600' }}>🟡 At Risk (2–7 days)</div>
              </div>
              <div className="glass-card" style={{ padding: '18px 20px', borderLeft: '3px solid #f43f5e', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#f43f5e' }}>{inactiveCount}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: '600' }}>🔴 Inactive (7+ days)</div>
              </div>
              <div className="glass-card" style={{ padding: '18px 20px', borderLeft: '3px solid var(--accent-gold)', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--accent-gold)' }}>
                  {sorted[0]?.current_streak || 0}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: '600' }}>🔥 Top Active Streak</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              {/* Header + Sort Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingUp size={20} style={{ color: 'var(--accent-gold)' }} /> Participant Consistency Tracker
                  </h2>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Monitor streaks, activity status, and study consistency for every participant.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Sort by:</span>
                  {[['streak','🔥 Streak'],['submissions','📖 Submissions'],['rate','📊 Rate'],['name','🔤 Name']].map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => setConsistencySort(val)}
                      style={{
                        padding: '5px 12px', fontSize: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', border: '1px solid',
                        background: consistencySort === val ? 'var(--accent-gold)' : 'transparent',
                        color: consistencySort === val ? '#1a1409' : 'var(--text-secondary)',
                        borderColor: consistencySort === val ? 'var(--accent-gold)' : 'var(--border-color)'
                      }}
                    >{label}</button>
                  ))}
                </div>
              </div>

              {/* Consistency Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      <th style={{ padding: '10px 14px' }}>#</th>
                      <th style={{ padding: '10px 14px' }}>Participant</th>
                      <th style={{ padding: '10px 14px' }}>Status</th>
                      <th style={{ padding: '10px 14px' }}>Current Streak</th>
                      <th style={{ padding: '10px 14px' }}>Longest Streak</th>
                      <th style={{ padding: '10px 14px', minWidth: '160px' }}>Streak Progress</th>
                      <th style={{ padding: '10px 14px' }}>Submissions</th>
                      <th style={{ padding: '10px 14px' }}>Consistency Rate</th>
                      <th style={{ padding: '10px 14px' }}>Last Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.length === 0 ? (
                      <tr>
                        <td colSpan="9" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                          No participants found.
                        </td>
                      </tr>
                    ) : sorted.map((u, idx) => {
                      const st = statusStyle[u.status];
                      const barPct = Math.min(100, Math.round(((u.longest_streak || 0) / maxStreak) * 100));
                      const rate = u.consistencyRate;
                      const lastActive = u.last_activity_date
                        ? new Date(u.last_activity_date).toLocaleDateString()
                        : (u.created_at ? new Date(u.created_at).toLocaleDateString() : '—');
                      const name = u.full_name || u.fullName || u.user_metadata?.full_name || 'Participant';

                      return (
                        <tr key={u.id || u.email} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '13px', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,160,23,0.04)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          {/* Rank */}
                          <td style={{ padding: '14px', fontWeight: '700', color: idx < 3 ? 'var(--accent-gold)' : 'var(--text-secondary)', fontSize: '14px' }}>
                            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                          </td>

                          {/* Name + Email */}
                          <td style={{ padding: '14px' }}>
                            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{u.email}</div>
                          </td>

                          {/* Activity Status */}
                          <td style={{ padding: '14px' }}>
                            <span style={{
                              display: 'inline-block', padding: '3px 10px', borderRadius: '12px',
                              fontSize: '11px', fontWeight: '700',
                              background: st.bg, color: st.color, border: `1px solid ${st.border}`
                            }}>{st.label}</span>
                          </td>

                          {/* Current Streak */}
                          <td style={{ padding: '14px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: '700', fontSize: '15px', color: (u.current_streak || 0) > 0 ? '#f43f5e' : 'var(--text-secondary)' }}>
                              {(u.current_streak || 0) > 0 ? <Flame size={15} /> : null}
                              {u.current_streak || 0} days
                            </span>
                          </td>

                          {/* Longest Streak */}
                          <td style={{ padding: '14px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--accent-gold)', fontWeight: '600' }}>
                              <Award size={13} />
                              {u.longest_streak || 0} days
                            </span>
                          </td>

                          {/* Visual Streak Bar */}
                          <td style={{ padding: '14px' }}>
                            <div style={{ position: 'relative', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden', minWidth: '120px' }}>
                              <div style={{
                                position: 'absolute', left: 0, top: 0, bottom: 0,
                                width: `${barPct}%`,
                                background: `linear-gradient(90deg, var(--accent-gold), #f43f5e)`,
                                borderRadius: '4px',
                                transition: 'width 0.5s ease'
                              }} />
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '3px' }}>{barPct}% of top</div>
                          </td>

                          {/* Submissions */}
                          <td style={{ padding: '14px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(212,160,23,0.12)', color: 'var(--accent-gold)', padding: '2px 10px', borderRadius: '10px', fontWeight: '700', fontSize: '13px' }}>
                              <BookOpen size={12} /> {u.totalSubmissions || 0}
                            </span>
                          </td>

                          {/* Consistency Rate */}
                          <td style={{ padding: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ position: 'relative', height: '6px', width: '60px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden', flexShrink: 0 }}>
                                <div style={{
                                  position: 'absolute', left: 0, top: 0, bottom: 0,
                                  width: `${rate}%`,
                                  background: rate >= 70 ? '#10b981' : rate >= 40 ? '#eab308' : '#f43f5e',
                                  borderRadius: '3px'
                                }} />
                              </div>
                              <span style={{ fontWeight: '700', fontSize: '13px', color: rate >= 70 ? '#10b981' : rate >= 40 ? '#eab308' : '#f43f5e' }}>
                                {rate}%
                              </span>
                            </div>
                          </td>

                          {/* Last Active */}
                          <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                              <Clock size={12} /> {lastActive}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <span><strong style={{ color: '#10b981' }}>🟢 Active</strong> — submitted in the last 24 hours</span>
                <span><strong style={{ color: '#eab308' }}>🟡 At Risk</strong> — no submission in 2–7 days</span>
                <span><strong style={{ color: '#f43f5e' }}>🔴 Inactive</strong> — no submission in 7+ days</span>
                <span style={{ marginLeft: 'auto' }}><strong>Consistency Rate</strong> = submissions ÷ days since joining</span>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
