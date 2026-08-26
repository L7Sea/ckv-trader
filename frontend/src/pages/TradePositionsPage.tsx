import React from 'react';
import { OrderForm } from '../components/OrderForm';
import { PositionsTable } from '../components/PositionsTable';
import { TransactionHistory } from '../components/TransactionHistory';

export const TradePositionsPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div id="order-form-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 sticky top-20">
          <OrderForm />
        </div>
        <div className="lg:col-span-8 space-y-6">
          <PositionsTable />
        </div>
      </div>
      <TransactionHistory />
    </div>
  );
};

export default TradePositionsPage;
