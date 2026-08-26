import React from 'react';
import { AnalyticsReport } from '../components/AnalyticsReport';

export const PerformanceAnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <AnalyticsReport />
    </div>
  );
};

export default PerformanceAnalyticsPage;
