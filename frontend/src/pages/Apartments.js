import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getApartments, addApartment, deleteApartment } from '../services/apartmentService';
import { card, grid, primaryBtn, dangerBtn, form, inputGroup, label, colors } from '../utils/styles';

function Apartments() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ flatNumber: '', floor: '', type: '', rentAmount: '', status: 'Vacant' });
  const role = localStorage.getItem('role') || 'ADMIN';

  useEffect(() => { fetchApartments(); }, []);

  const fetchApartments = async () => {
    try {
      const data = await getApartments();
      setApartments(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addApartment(formData);
      setShowForm(false);
      setFormData({ flatNumber: '', floor: '', type: '', rentAmount: '', status: 'Vacant' });
      fetchApartments();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this apartment?')) {
      await deleteApartment(id);
      fetchApartments();
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: colors.bg }}>
      <Navbar role={role} />
      <div style={{ padding: '28px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <p style={{ color: '#666', fontSize: '13px' }}>Manage</p>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '500' }}>Apartments</h2>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={primaryBtn}>
            {showForm ? 'Cancel' : '+ Add Apartment'}
          </button>
        </div>

        {showForm && (
          <div style={form}>
            <div style={inputGroup}>
              <span style={label}>Flat number</span>
              <input name="flatNumber" placeholder="101" value={formData.flatNumber} onChange={handleChange} />
            </div>
            <div style={inputGroup}>
              <span style={label}>Floor</span>
              <input name="floor" type="number" placeholder="1" value={formData.floor} onChange={handleChange} />
            </div>
            <div style={inputGroup}>
              <span style={label}>Type</span>
              <input name="type" placeholder="2BHK" value={formData.type} onChange={handleChange} />
            </div>
            <div style={inputGroup}>
              <span style={label}>Rent (₹)</span>
              <input name="rentAmount" type="number" placeholder="12000" value={formData.rentAmount} onChange={handleChange} />
            </div>
            <div style={inputGroup}>
              <span style={label}>Status</span>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="Vacant">Vacant</option>
                <option value="Occupied">Occupied</option>
              </select>
            </div>
            <button onClick={handleAdd} style={{ ...primaryBtn, alignSelf: 'flex-end' }}>Save</button>
          </div>
        )}

        {loading ? <p style={{ color: '#666', marginTop: '20px' }}>Loading...</p> : (
          <div style={grid}>
            {apartments.map((apt) => (
              <div key={apt.id} style={card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ background: '#4361ee20', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b8aff', fontWeight: '500' }}>
                    {apt.flatNumber}
                  </div>
                  <span style={{ background: apt.status === 'Occupied' ? '#ff4d4d20' : '#2ecc7120', color: apt.status === 'Occupied' ? '#ff4d4d' : '#2ecc71', padding: '3px 10px', borderRadius: '20px', fontSize: '12px' }}>
                    {apt.status}
                  </span>
                </div>
                <h4 style={{ color: '#fff', marginBottom: '8px' }}>Flat {apt.flatNumber}</h4>
                <p style={{ color: '#888', fontSize: '13px', marginBottom: '4px' }}>Floor {apt.floor}</p>
                <p style={{ color: '#888', fontSize: '13px', marginBottom: '4px' }}>{apt.type}</p>
                <p style={{ color: '#6b8aff', fontSize: '15px', fontWeight: '500', marginBottom: '16px' }}>₹{apt.rentAmount}/mo</p>
                <button onClick={() => handleDelete(apt.id)} style={dangerBtn}>Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Apartments;