import React from 'react';
import styles from './App.module.css';
import Auth from './features/auth/Auth';
import Core from './features/core/Core';
function App() {
  return (
  <div className={styles.app}>
    <Auth />
  </div>
  )   
}

export default App;
