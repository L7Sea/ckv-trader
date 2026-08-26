import React from 'react';
import { PositionDecisionEngine } from '../components/PositionDecisionEngine';

export const PositionRiskPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PositionDecisionEngine />
    </div>
  );
};

export default PositionRiskPage;
