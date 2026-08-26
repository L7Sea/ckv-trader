import React from 'react';
import { DailyAIRecommendations } from '../components/DailyAIRecommendations';
import { MarketIntelligenceDashboard } from '../components/MarketIntelligenceDashboard';

export const MarketIntelligencePage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <DailyAIRecommendations />
      <MarketIntelligenceDashboard />
    </div>
  );
};

export default MarketIntelligencePage;
