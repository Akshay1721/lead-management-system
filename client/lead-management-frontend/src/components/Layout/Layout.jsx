import React from 'react';
import Header from './Header.jsx';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;