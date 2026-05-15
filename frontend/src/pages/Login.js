import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconWrap}>🏢</div>
        <h2 style={styles.title}>ApartmentMS</h2>
        <p style={styles.subtitle}>Sign in to your account</p>

        {error && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email" name="email"
              value={formData.email} onChange={handleChange}
              placeholder="admin@apartment.com" required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password" name="password"
              value={formData.password} onChange={handleChange}
              placeholder="••••••••" required
            />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0f0f13',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    background: '#17171f',
    border: '1px solid #2a2a3a',
    borderRadius: '16px',
    padding: '40px',
    width: '380px'
  },
  iconWrap: {
    fontSize: '32px',
    textAlign: 'center',
    marginBottom: '12px'
  },
  title: {
    color: '#fff',
    fontSize: '22px',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: '6px'
  },
  subtitle: {
    color: '#666',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '28px'
  },
  inputGroup: {
    marginBottom: '16px'
  },
  label: {
    color: '#888',
    fontSize: '12px',
    display: 'block',
    marginBottom: '6px'
  },
  errorBox: {
    background: '#ff4d4d15',
    border: '1px solid #ff4d4d30',
    color: '#ff4d4d',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '16px',
    textAlign: 'center'
  },
  button: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #e879a0, #4361ee)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '500',
    marginTop: '8px',
    cursor: 'pointer'
  }
};

export default Login;