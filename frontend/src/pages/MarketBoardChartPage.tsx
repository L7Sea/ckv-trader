import React from 'react';
import { MarketBoard } from '../components/MarketBoard';
import { TechnicalChart } from '../components/TechnicalChart';

export const MarketBoardChartPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <TechnicalChart />
      <MarketBoard />
    </div>
  );
};

export default MarketBoardChartPage;
