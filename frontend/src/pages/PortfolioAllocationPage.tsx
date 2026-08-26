import React from 'react';
import { PortfolioCharts } from '../components/PortfolioCharts';

export const PortfolioAllocationPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PortfolioCharts />
    </div>
  );
};

export default PortfolioAllocationPage;
