import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../services/authService';

function Navbar({ role }) {
  const navigate = useNavigate();
  const location = useLocation();

  const allNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '▪', roles: ['ADMIN', 'TENANT', 'OWNER'] },
    { label: 'Apartments', path: '/apartments', icon: '▪', roles: ['ADMIN'] },
    { label: 'Tenants', path: '/tenants', icon: '▪', roles: ['ADMIN'] },
    { label: 'Rent', path: '/rent', icon: '▪', roles: ['ADMIN', 'TENANT'] },
    { label: 'Complaints', path: '/complaints', icon: '▪', roles: ['ADMIN', 'TENANT', 'OWNER'] },
    { label: 'Maintenance', path: '/maintenance', icon: '▪', roles: ['ADMIN', 'TENANT', 'OWNER'] },
    { label: 'Notices', path: '/notices', icon: '▪', roles: ['ADMIN', 'TENANT', 'OWNER'] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(role));

  const getRoleColor = () => {
    if (role === 'ADMIN') return { bg: '#4361ee20', color: '#6b8aff' };
    if (role === 'TENANT') return { bg: '#e879a020', color: '#e879a0' };
    return { bg: '#2ecc7120', color: '#2ecc71' };
  };

  const roleStyle = getRoleColor();
  const initial = role ? role[0] : '?';

  return (
    <div style={styles.navbar}>
      <div style={styles.left}>
        <span style={styles.logo}>🏢 ApartmentMS</span>
        <div style={styles.navLinks}>
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                ...styles.navBtn,
                background: location.pathname === item.path ? '#e879a020' : 'transparent',
                color: location.pathname === item.path ? '#e879a0' : '#888',
                border: location.pathname === item.path
                  ? '1px solid #e879a030'
                  : '1px solid transparent'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div style={styles.right}>
        <span style={{
          background: roleStyle.bg,
          color: roleStyle.color,
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '500'
        }}>
          {role}
        </span>
        <div style={styles.avatar}>{initial}</div>
        <button onClick={logout} style={styles.logoutBtn}>Logout</button>
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    background: '#17171f',
    borderBottom: '1px solid #2a2a3a',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '56px',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px'
  },
  logo: {
    color: '#fff',
    fontSize: '16px',
    fontWeight: '500',
    whiteSpace: 'nowrap'
  },
  navLinks: {
    display: 'flex',
    gap: '4px'
  },
  navBtn: {
    padding: '6px 14px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '400',
    transition: 'all 0.2s'
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#e879a030',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#e879a0',
    fontSize: '13px',
    fontWeight: '500'
  },
  logoutBtn: {
    background: '#ff4d4d20',
    color: '#ff4d4d',
    border: '1px solid #ff4d4d30',
    padding: '6px 14px',
    borderRadius: '6px',
    fontSize: '13px'
  }
};

export default Navbar;