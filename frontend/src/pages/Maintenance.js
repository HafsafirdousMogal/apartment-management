import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getMaintenanceCharges, markChargeAsPaid } from '../services/maintenanceService';
import { card, grid, successBtn, colors } from '../utils/styles';



function Maintenance() {
  const navigate = useNavigate();
  const [charges, setCharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem('role') || 'ADMIN';

  useEffect(() => { fetchCharges(); }, []);

  const fetchCharges = async () => {
    try {
      const data = await getMaintenanceCharges();
      const email = localStorage.getItem('email');
      const role = localStorage.getItem('role');
      setCharges(role === 'ADMIN' ? data : data.filter(c => c.tenant?.email === email));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }; 

  const handlePay = async (id) => {
    await markChargeAsPaid(id);
    fetchCharges();
  };

  return (
    <div style={{ minHeight: '100vh', background: colors.bg }}>
      <Navbar role={role} />
      <div style={{ padding: '28px 24px' }}>
        <div style={{ marginBottom: '8px' }}>
          <p style={{ color: '#666', fontSize: '13px' }}>Track</p>
          <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '500' }}>Maintenance Charges</h2>
        </div>

        {loading ? <p style={{ color: '#666', marginTop: '20px' }}>Loading...</p> : (
          <div style={grid}>
            {charges.length === 0 ? (
              <p style={{ color: '#555' }}>No charges found.</p>
            ) : charges.map((c) => (
              <div key={c.id} style={card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h4 style={{ color: '#fff' }}>{c.tenant?.name}</h4>
                  <span style={{ background: c.status === 'Paid' ? '#2ecc7120' : '#ff4d4d20', color: c.status === 'Paid' ? '#2ecc71' : '#ff4d4d', padding: '3px 10px', borderRadius: '20px', fontSize: '12px' }}>
                    {c.status}
                  </span>
                </div>
                <p style={{ color: '#888', fontSize: '13px', marginBottom: '4px' }}>🏠 Flat {c.apartment?.flatNumber}</p>
                <p style={{ color: '#888', fontSize: '13px', marginBottom: '4px' }}>📅 {c.month}</p>
                <p style={{ color: '#6b8aff', fontSize: '15px', fontWeight: '500', marginBottom: '4px' }}>₹{c.amount}</p>
                <p style={{ color: '#555', fontSize: '12px', marginBottom: '16px' }}>Due: {c.dueAt}</p>
                {c.status !== 'Paid' && role !== 'ADMIN' && (
                  <button
                    onClick={() => navigate('/payment', {
                      state: {
                        paymentId: c.id,
                        amount: c.amount,
                        month: c.month,
                        type: 'maintenance'
                      }
                    })}
                    style={successBtn}>
                    Pay Now
                  </button>
                )}
                {c.paidAt && <p style={{ color: '#2ecc71', fontSize: '12px', marginTop: '8px' }}>Paid on {c.paidAt}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Maintenance;