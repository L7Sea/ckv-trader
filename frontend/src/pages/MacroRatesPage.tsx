import React from 'react';
import MacroInterestRateEngine from '../components/MacroInterestRateEngine';

export const MacroRatesPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <MacroInterestRateEngine />
    </div>
  );
};

export default MacroRatesPage;
