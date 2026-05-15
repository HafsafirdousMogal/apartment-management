import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getTenants, addTenant, deleteTenant } from '../services/tenantService';
import { getApartments } from '../services/apartmentService';
import { card, grid, primaryBtn, dangerBtn, form, inputGroup, label, colors } from '../utils/styles';

function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', status: 'Active' });
  const [selectedApartmentId, setSelectedApartmentId] = useState('');
  const role = localStorage.getItem('role') || 'ADMIN';

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [t, a] = await Promise.all([getTenants(), getApartments()]);
      setTenants(t);
      setApartments(a);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addTenant(selectedApartmentId, formData);
      setShowForm(false);
      setFormData({ name: '', email: '', phone: '', status: 'Active' });
      fetchAll();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this tenant?')) {
      await deleteTenant(id);
      fetchAll();
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: colors.bg }}>
      <Navbar role={role} />
      <div style={{ padding: '28px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <p style={{ color: '#666', fontSize: '13px' }}>Manage</p>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '500' }}>Tenants</h2>
          </div>
          {role === 'ADMIN' && (
            <button onClick={() => setShowForm(!showForm)} style={primaryBtn}>
              {showForm ? 'Cancel' : '+ Add Tenant'}
            </button>
          )}
        </div>

        {showForm && (
          <div style={form}>
            <div style={inputGroup}>
              <span style={label}>Full name</span>
              <input name="name" placeholder="Rahul Sharma" value={formData.name} onChange={handleChange} />
            </div>
            <div style={inputGroup}>
              <span style={label}>Email</span>
              <input name="email" type="email" placeholder="rahul@gmail.com" value={formData.email} onChange={handleChange} />
            </div>
            <div style={inputGroup}>
              <span style={label}>Phone</span>
              <input name="phone" placeholder="9876543210" value={formData.phone} onChange={handleChange} />
            </div>
            <div style={inputGroup}>
              <span style={label}>Apartment</span>
              <select value={selectedApartmentId} onChange={(e) => setSelectedApartmentId(e.target.value)}>
                <option value="">Select flat</option>
                {apartments.map((apt) => (
                  <option key={apt.id} value={apt.id}>Flat {apt.flatNumber} - {apt.type}</option>
                ))}
              </select>
            </div>
            <button onClick={handleAdd} style={{ ...primaryBtn, alignSelf: 'flex-end' }}>Save</button>
          </div>
        )}

        {loading ? <p style={{ color: '#666', marginTop: '20px' }}>Loading...</p> : (
          <div style={grid}>
            {tenants.map((tenant) => (
              <div key={tenant.id} style={card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e879a020', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e879a0', fontWeight: '500' }}>
                    {tenant.name[0]}
                  </div>
                  <span style={{ background: tenant.status === 'Active' ? '#2ecc7120' : '#ff4d4d20', color: tenant.status === 'Active' ? '#2ecc71' : '#ff4d4d', padding: '3px 10px', borderRadius: '20px', fontSize: '12px' }}>
                    {tenant.status}
                  </span>
                </div>
                <h4 style={{ color: '#fff', marginBottom: '8px' }}>{tenant.name}</h4>
                <p style={{ color: '#888', fontSize: '13px', marginBottom: '4px' }}>✉ {tenant.email}</p>
                <p style={{ color: '#888', fontSize: '13px', marginBottom: '4px' }}>📞 {tenant.phone}</p>
                <p style={{ color: '#6b8aff', fontSize: '13px', marginBottom: '16px' }}>🏠 Flat {tenant.apartment?.flatNumber}</p>
                {role === 'ADMIN' && (
                  <button onClick={() => handleDelete(tenant.id)} style={dangerBtn}>Delete</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Tenants;