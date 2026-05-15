import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getNotices, addNotice, deleteNotice } from '../services/noticeService';
import { primaryBtn, dangerBtn, form, inputGroup, label, colors } from '../utils/styles';

function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', postedBy: 'Admin' });
  const role = localStorage.getItem('role') || 'ADMIN';

  useEffect(() => { fetchNotices(); }, []);

  const fetchNotices = async () => {
    try {
      const data = await getNotices();
      setNotices(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addNotice(formData);
      setShowForm(false);
      setFormData({ title: '', description: '', postedBy: 'Admin' });
      fetchNotices();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this notice?')) {
      await deleteNotice(id);
      fetchNotices();
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: colors.bg }}>
      <Navbar role={role} />
      <div style={{ padding: '28px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <p style={{ color: '#666', fontSize: '13px' }}>Announcements</p>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '500' }}>Notice Board</h2>
          </div>
          {role === 'ADMIN' && (
            <button onClick={() => setShowForm(!showForm)} style={primaryBtn}>
              {showForm ? 'Cancel' : '+ Post Notice'}
            </button>
          )}
        </div>

        {showForm && (
          <div style={form}>
            <div style={inputGroup}>
              <span style={label}>Title</span>
              <input name="title" placeholder="Notice title" value={formData.title} onChange={handleChange} />
            </div>
            <div style={{ ...inputGroup, minWidth: '320px' }}>
              <span style={label}>Description</span>
              <textarea name="description" placeholder="Write the notice..." value={formData.description} onChange={handleChange} style={{ height: '80px' }} />
            </div>
            <button onClick={handleAdd} style={{ ...primaryBtn, alignSelf: 'flex-end' }}>Post</button>
          </div>
        )}

        {loading ? <p style={{ color: '#666', marginTop: '20px' }}>Loading...</p> : (
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notices.length === 0 ? (
              <p style={{ color: '#555' }}>No notices posted yet.</p>
            ) : notices.map((n) => (
              <div key={n.id} style={{ background: '#17171f', border: '1px solid #2a2a3a', borderLeft: '3px solid #e879a0', borderRadius: '10px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ color: '#fff', marginBottom: '8px' }}>📋 {n.title}</h4>
                    <p style={{ color: '#888', fontSize: '14px', marginBottom: '10px' }}>{n.description}</p>
                    <p style={{ color: '#555', fontSize: '12px' }}>Posted by {n.postedBy} · {n.postedAt}</p>
                  </div>
                  {role === 'ADMIN' && (
                    <button onClick={() => handleDelete(n.id)} style={{ ...dangerBtn, marginLeft: '16px' }}>Delete</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notices;