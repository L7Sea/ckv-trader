import React from 'react';
import { QuickRadarSearch } from '../components/QuickRadarSearch';
import { FiftyAlgorithmsReport } from '../components/FiftyAlgorithmsReport';

export const RadarAlgorithmsPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <QuickRadarSearch />
      <FiftyAlgorithmsReport />
    </div>
  );
};

export default RadarAlgorithmsPage;
