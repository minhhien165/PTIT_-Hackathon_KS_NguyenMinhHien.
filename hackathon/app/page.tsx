// pages/index.tsx
import React from 'react';
import EmployeeList from './users/page';

const HomePage: React.FC = () => {
  return (
    <div className="container mt-4">
      <h1>Quản lý nhân viên</h1>
      <EmployeeList />
    </div>
  );
};

export default HomePage;
