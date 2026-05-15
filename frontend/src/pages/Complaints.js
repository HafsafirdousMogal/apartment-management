import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getComplaints, raiseComplaint, updateComplaintStatus } from '../services/maintenanceService';
import { getTenants } from '../services/tenantService';
import { card, grid, primaryBtn, form, inputGroup, label, colors } from '../utils/styles';

function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [selectedTenant, setSelectedTenant] = useState('');
  const role = localStorage.getItem('role') || 'ADMIN';

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [c, t] = await Promise.all([getComplaints(), getTenants()]);
      setComplaints(c);
      setTenants(t);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    const tenant = tenants.find(t => t.id === parseInt(selectedTenant));
    try {
      await raiseComplaint(tenant.id, tenant.apartment.id, formData);
      setShowForm(false);
      setFormData({ title: '', description: '' });
      fetchAll();
    } catch (err) { console.error(err); }
  };

  const handleStatus = async (id, status) => {
    await updateComplaintStatus(id, status);
    fetchAll();
  };

  const statusColor = (s) => {
    if (s === 'Resolved') return { bg: '#2ecc7120', color: '#2ecc71' };
    if (s === 'In Progress') return { bg: '#f39c1220', color: '#f39c12' };
    return { bg: '#ff4d4d20', color: '#ff4d4d' };
  };

  return (
    <div style={{ minHeight: '100vh', background: colors.bg }}>
      <Navbar role={role} />
      <div style={{ padding: '28px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <p style={{ color: '#666', fontSize: '13px' }}>Track</p>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '500' }}>Maintenance Complaints</h2>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={primaryBtn}>
            {showForm ? 'Cancel' : '+ Raise Complaint'}
          </button>
        </div>

        {showForm && (
          <div style={form}>
            <div style={inputGroup}>
              <span style={label}>Tenant</span>
              <select value={selectedTenant} onChange={(e) => setSelectedTenant(e.target.value)}>
                <option value="">Select tenant</option>
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} - Flat {t.apartment?.flatNumber}</option>
                ))}
              </select>
            </div>
            <div style={inputGroup}>
              <span style={label}>Issue title</span>
              <input name="title" placeholder="Leaking tap" value={formData.title} onChange={handleChange} />
            </div>
            <div style={{ ...inputGroup, minWidth: '280px' }}>
              <span style={label}>Description</span>
              <textarea name="description" placeholder="Describe the issue..." value={formData.description} onChange={handleChange} style={{ height: '80px' }} />
            </div>
            <button onClick={handleAdd} style={{ ...primaryBtn, alignSelf: 'flex-end' }}>Submit</button>
          </div>
        )}

        {loading ? <p style={{ color: '#666', marginTop: '20px' }}>Loading...</p> : (
          <div style={grid}>
            {complaints.map((c) => {
              const sc = statusColor(c.status);
              return (
                <div key={c.id} style={card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h4 style={{ color: '#fff' }}>🔧 {c.title}</h4>
                    <span style={{ background: sc.bg, color: sc.color, padding: '3px 10px', borderRadius: '20px', fontSize: '12px' }}>
                      {c.status}
                    </span>
                  </div>
                  <p style={{ color: '#888', fontSize: '13px', marginBottom: '8px' }}>{c.description}</p>
                  <p style={{ color: '#888', fontSize: '13px', marginBottom: '4px' }}>👤 {c.tenant?.name}</p>
                  <p style={{ color: '#6b8aff', fontSize: '13px', marginBottom: '4px' }}>🏠 Flat {c.apartment?.flatNumber}</p>
                  <p style={{ color: '#555', fontSize: '12px', marginBottom: '16px' }}>📅 {c.createdAt}</p>
                  {c.status !== 'Resolved' && role === 'ADMIN' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {c.status === 'Pending' && (
                        <button onClick={() => handleStatus(c.id, 'In Progress')}
                          style={{ background: '#f39c1220', border: '1px solid #f39c1230', color: '#f39c12', padding: '6px 10px', borderRadius: '6px', fontSize: '12px' }}>
                          In Progress
                        </button>
                      )}
                      <button onClick={() => handleStatus(c.id, 'Resolved')}
                        style={{ background: '#2ecc7120', border: '1px solid #2ecc7130', color: '#2ecc71', padding: '6px 10px', borderRadius: '6px', fontSize: '12px' }}>
                        Resolve
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Complaints;