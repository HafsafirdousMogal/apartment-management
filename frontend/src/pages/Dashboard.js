import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getApartments } from '../services/apartmentService';
import { getTenants, getMyProfile } from '../services/tenantService';
import { getRentPayments } from '../services/rentService';
import { getComplaints, getMaintenanceCharges } from '../services/maintenanceService';
import { getNotices } from '../services/noticeService';
import { colors } from '../utils/styles';

function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || 'ADMIN';
  const email = localStorage.getItem('email') || '';

  const [stats, setStats] = useState({
    apartments: 0, tenants: 0, pendingRent: 0, pendingComplaints: 0
  });
  const [myProfile, setMyProfile] = useState(null);
  const [myRent, setMyRent] = useState([]);
  const [myCharges, setMyCharges] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role === 'ADMIN') fetchAdminStats();
    else fetchTenantData();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const [apts, tenants, rent, complaints, noticeList] = await Promise.all([
        getApartments(), getTenants(), getRentPayments(),
        getComplaints(), getNotices()
      ]);
      setStats({
        apartments: apts.length,
        tenants: tenants.length,
        pendingRent: rent.filter(r => r.status !== 'Paid').length,
        pendingComplaints: complaints.filter(c => c.status !== 'Resolved').length
      });
      setNotices(noticeList.slice(0, 3));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchTenantData = async () => {
    try {
      const [profile, rent, charges, noticeList] = await Promise.all([
        getMyProfile(email),
        getRentPayments(),
        getMaintenanceCharges(),
        getNotices()
      ]);
      setMyProfile(profile);
      setMyRent(rent.filter(r => r.tenant?.email === email && r.status !== 'Paid'));
      setMyCharges(charges.filter(c => c.tenant?.email === email && c.status !== 'Paid'));
      setNotices(noticeList.slice(0, 3));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const adminQuickActions = [
    { label: 'Add apartment', color: '#e879a0', bg: '#e879a015', border: '#e879a030', path: '/apartments' },
    { label: 'Add tenant', color: '#6b8aff', bg: '#4361ee15', border: '#4361ee30', path: '/tenants' },
    { label: 'Post notice', color: '#2ecc71', bg: '#2ecc7115', border: '#2ecc7130', path: '/notices' },
    { label: 'View complaints', color: '#f39c12', bg: '#f39c1215', border: '#f39c1230', path: '/complaints' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: colors.bg }}>
      <Navbar role={role} />
      <div style={{ padding: '28px 24px' }}>

        <div style={{ marginBottom: '24px' }}>
          <p style={{ color: '#666', fontSize: '13px' }}>Welcome back</p>
          <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '500' }}>
            {role === 'ADMIN' ? 'Admin Dashboard' : role === 'TENANT' ? 'My Home' : 'Owner Dashboard'}
          </h2>
        </div>

        {loading ? <p style={{ color: '#666' }}>Loading...</p> : (

          role === 'ADMIN' ? (
            <>
              <div style={styles.grid4}>
                {[
                  { label: 'Total Flats', value: stats.apartments, color: '#6b8aff', bg: '#4361ee20' },
                  { label: 'Tenants', value: stats.tenants, color: '#e879a0', bg: '#e879a020' },
                  { label: 'Pending Rent', value: stats.pendingRent, color: '#ff4d4d', bg: '#ff4d4d20' },
                  { label: 'Open Complaints', value: stats.pendingComplaints, color: '#f39c12', bg: '#f39c1220' },
                ].map((card) => (
                  <div key={card.label} style={styles.statCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ color: '#666', fontSize: '12px', marginBottom: '8px' }}>{card.label}</p>
                        <p style={{ color: '#fff', fontSize: '28px', fontWeight: '500' }}>{card.value}</p>
                      </div>
                      <div style={{ background: card.bg, width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: card.color }}>■</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.grid2}>
                <div style={styles.panel}>
                  <h3 style={styles.panelTitle}>⚡ Quick actions</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {adminQuickActions.map((action) => (
                      <button key={action.label} onClick={() => navigate(action.path)}
                        style={{ background: action.bg, border: `1px solid ${action.border}`, color: action.color, padding: '10px 14px', borderRadius: '8px', textAlign: 'left', fontSize: '13px' }}>
                        + {action.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={styles.panel}>
                  <h3 style={styles.panelTitle}>📋 Latest notices</h3>
                  {notices.length === 0 ? <p style={{ color: '#555', fontSize: '13px' }}>No notices yet.</p> : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {notices.map((n) => (
                        <div key={n.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e879a0', marginTop: '4px', flexShrink: 0 }}></div>
                          <div>
                            <p style={{ color: '#ddd', fontSize: '13px', fontWeight: '500' }}>{n.title}</p>
                            <p style={{ color: '#555', fontSize: '12px' }}>{n.postedAt}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              {myProfile && (
                <div style={{ ...styles.panel, marginBottom: '16px', display: 'flex', gap: '24px', alignItems: 'center' }}>
                  <div style={{ background: '#e879a020', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e879a0', fontSize: '22px', fontWeight: '500', flexShrink: 0 }}>
                    {myProfile.name[0]}
                  </div>
                  <div>
                    <h3 style={{ color: '#fff', fontWeight: '500', marginBottom: '4px' }}>{myProfile.name}</h3>
                    <p style={{ color: '#888', fontSize: '13px', marginBottom: '2px' }}>📧 {myProfile.email}</p>
                    <p style={{ color: '#6b8aff', fontSize: '13px' }}>🏠 Flat {myProfile.apartment?.flatNumber} · {myProfile.apartment?.type} · Floor {myProfile.apartment?.floor}</p>
                  </div>
                  <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <p style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>Monthly rent</p>
                    <p style={{ color: '#2ecc71', fontSize: '22px', fontWeight: '500' }}>₹{myProfile.apartment?.rentAmount}</p>
                  </div>
                </div>
              )}

              <div style={styles.grid2}>
                <div style={styles.panel}>
                  <h3 style={styles.panelTitle}>💰 Pending rent</h3>
                  {myRent.length === 0 ? (
                    <p style={{ color: '#2ecc71', fontSize: '13px' }}>✅ All rent paid!</p>
                  ) : myRent.map((r) => (
                    <div key={r.id} style={{ background: '#ff4d4d10', border: '1px solid #ff4d4d20', borderRadius: '8px', padding: '12px', marginBottom: '8px' }}>
                      <p style={{ color: '#fff', fontSize: '13px', fontWeight: '500' }}>{r.month}</p>
                      <p style={{ color: '#ff4d4d', fontSize: '15px', fontWeight: '500' }}>₹{r.amount}</p>
                      <p style={{ color: '#666', fontSize: '12px' }}>Due: {r.dueDate}</p>
                    </div>
                  ))}
                </div>

                <div style={styles.panel}>
                  <h3 style={styles.panelTitle}>🧹 Pending maintenance</h3>
                  {myCharges.length === 0 ? (
                    <p style={{ color: '#2ecc71', fontSize: '13px' }}>✅ All charges paid!</p>
                  ) : myCharges.map((c) => (
                    <div key={c.id} style={{ background: '#f39c1210', border: '1px solid #f39c1220', borderRadius: '8px', padding: '12px', marginBottom: '8px' }}>
                      <p style={{ color: '#fff', fontSize: '13px', fontWeight: '500' }}>{c.month}</p>
                      <p style={{ color: '#f39c12', fontSize: '15px', fontWeight: '500' }}>₹{c.amount}</p>
                      <p style={{ color: '#666', fontSize: '12px' }}>Due: {c.dueAt}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ ...styles.panel, marginTop: '16px' }}>
                <h3 style={styles.panelTitle}>📋 Notices</h3>
                {notices.length === 0 ? <p style={{ color: '#555', fontSize: '13px' }}>No notices.</p> : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {notices.map((n) => (
                      <div key={n.id} style={{ borderLeft: '3px solid #e879a0', paddingLeft: '12px' }}>
                        <p style={{ color: '#ddd', fontSize: '13px', fontWeight: '500' }}>{n.title}</p>
                        <p style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>{n.description}</p>
                        <p style={{ color: '#555', fontSize: '12px', marginTop: '4px' }}>{n.postedAt}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}

const styles = {
  grid4: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '12px',
    marginBottom: '16px'
  },
  statCard: {
    background: '#17171f',
    border: '1px solid #2a2a3a',
    borderRadius: '10px',
    padding: '16px'
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  panel: {
    background: '#17171f',
    border: '1px solid #2a2a3a',
    borderRadius: '10px',
    padding: '20px'
  },
  panelTitle: {
    color: '#fff',
    fontSize: '15px',
    fontWeight: '500',
    marginBottom: '16px'
  }
};

export default Dashboard;