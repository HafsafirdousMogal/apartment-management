import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getRentPayments, createRentPayment, markRentAsPaid } from '../services/rentService';
import { getTenants } from '../services/tenantService';
import { card, grid, primaryBtn, successBtn, form, inputGroup, label, colors } from '../utils/styles';



function Rent() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ amount: '', month: '', dueDate: '' });
  const [selectedTenant, setSelectedTenant] = useState('');
  const role = localStorage.getItem('role') || 'ADMIN';

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [p, t] = await Promise.all([getRentPayments(), getTenants()]);
      const email = localStorage.getItem('email');
      const role = localStorage.getItem('role');
      // Admin sees all, tenant sees only their own
      setPayments(role === 'ADMIN' ? p : p.filter(pay => pay.tenant?.email === email));
      setTenants(t);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    const tenant = tenants.find(t => t.id === parseInt(selectedTenant));
    try {
      await createRentPayment(tenant.id, tenant.apartment.id, formData);
      setShowForm(false);
      setFormData({ amount: '', month: '', dueDate: '' });
      fetchAll();
    } catch (err) { console.error(err); }
  };

  const handlePay = async (id) => {
    await markRentAsPaid(id);
    fetchAll();
  };

  return (
    <div style={{ minHeight: '100vh', background: colors.bg }}>
      <Navbar role={role} />
      <div style={{ padding: '28px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <p style={{ color: '#666', fontSize: '13px' }}>Track</p>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '500' }}>Rent Payments</h2>
          </div>
          {role === 'ADMIN' && (
            <button onClick={() => setShowForm(!showForm)} style={primaryBtn}>
              {showForm ? 'Cancel' : '+ Add Payment'}
            </button>
          )}
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
              <span style={label}>Amount (₹)</span>
              <input name="amount" type="number" placeholder="12000" value={formData.amount} onChange={handleChange} />
            </div>
            <div style={inputGroup}>
              <span style={label}>Month</span>
              <input name="month" placeholder="May 2026" value={formData.month} onChange={handleChange} />
            </div>
            <div style={inputGroup}>
              <span style={label}>Due date</span>
              <input name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} />
            </div>
            <button onClick={handleAdd} style={{ ...primaryBtn, alignSelf: 'flex-end' }}>Save</button>
          </div>
        )}

        {loading ? <p style={{ color: '#666', marginTop: '20px' }}>Loading...</p> : (
          <div style={grid}>
            {payments.map((p) => (
              <div key={p.id} style={card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h4 style={{ color: '#fff' }}>{p.tenant?.name}</h4>
                  <span style={{ background: p.status === 'Paid' ? '#2ecc7120' : '#ff4d4d20', color: p.status === 'Paid' ? '#2ecc71' : '#ff4d4d', padding: '3px 10px', borderRadius: '20px', fontSize: '12px' }}>
                    {p.status}
                  </span>
                </div>
                <p style={{ color: '#888', fontSize: '13px', marginBottom: '4px' }}>🏠 Flat {p.apartment?.flatNumber}</p>
                <p style={{ color: '#888', fontSize: '13px', marginBottom: '4px' }}>📅 {p.month}</p>
                <p style={{ color: '#6b8aff', fontSize: '15px', fontWeight: '500', marginBottom: '4px' }}>₹{p.amount}</p>
                <p style={{ color: '#555', fontSize: '12px', marginBottom: '16px' }}>Due: {p.dueDate}</p>
                {p.status !== 'Paid' && role !== 'ADMIN' && (
                  <button
                    onClick={() => navigate('/payment', {
                      state: {
                        paymentId: p.id,
                        amount: p.amount,
                        month: p.month,
                        type: 'rent'
                      }
                    })}
                    style={successBtn}>
                    Pay Now
                  </button>
                )}
                {p.paidDate && <p style={{ color: '#2ecc71', fontSize: '12px', marginTop: '8px' }}>Paid on {p.paidDate}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Rent;