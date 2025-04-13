import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const TopBar = ({ username }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => navigate('/login'))
      .catch((error) => console.error('Logout error:', error));
  };

  const handleViewMap = () => {
    navigate('/map');
  };

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <h2>ZeroWaste</h2>
      </div>
      <div style={styles.right}>
        <span style={styles.username}>Hi, {username}</span>
        <button onClick={handleViewMap} style={styles.mapButton}>View Map</button>
        <button onClick={handleLogout} style={styles.button}>Logout</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: '#f2efe7',
    padding: '12px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #ccc',
  },
  left: {
    fontWeight: 'bold',
    color: '#006a71',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  username: {
    fontSize: '16px',
    color: '#006a71',
  },
  mapButton: {
    padding: '6px 12px',
    backgroundColor: '#48A6A7',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  button: {
    padding: '6px 12px',
    backgroundColor: '#006a71',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
  },
};

export default TopBar;
