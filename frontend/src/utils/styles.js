export const colors = {
  bg: '#0f0f13',
  surface: '#17171f',
  border: '#2a2a3a',
  pink: '#e879a0',
  blue: '#6b8aff',
  green: '#2ecc71',
  orange: '#f39c12',
  red: '#ff4d4d',
  text: '#ffffff',
  muted: '#888888',
  dim: '#555555'
};

export const pageWrapper = {
  minHeight: '100vh',
  background: colors.bg
};

export const contentPadding = {
  padding: '28px 24px'
};

export const card = {
  background: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: '10px',
  padding: '20px'
};

export const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  gap: '16px',
  marginTop: '20px'
};

export const primaryBtn = {
  background: '#e879a020',
  border: '1px solid #e879a030',
  color: '#e879a0',
  padding: '10px 20px',
  borderRadius: '8px',
  fontSize: '14px'
};

export const dangerBtn = {
  background: '#ff4d4d20',
  border: '1px solid #ff4d4d30',
  color: '#ff4d4d',
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '13px'
};

export const successBtn = {
  background: '#2ecc7120',
  border: '1px solid #2ecc7130',
  color: '#2ecc71',
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '13px'
};

export const form = {
  background: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: '10px',
  padding: '20px',
  marginTop: '16px',
  display: 'flex',
  gap: '12px',
  flexWrap: 'wrap',
  alignItems: 'flex-end'
};

export const inputGroup = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  minWidth: '160px'
};

export const label = {
  color: '#888',
  fontSize: '12px'
};