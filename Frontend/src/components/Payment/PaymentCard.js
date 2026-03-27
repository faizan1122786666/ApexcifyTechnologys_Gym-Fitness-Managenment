import React from 'react';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/helpers';

const PaymentCard = ({ payment }) => {
  return (
    <div className="flex items-center gap-4 p-4 glass-card-hover">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
        payment.method === 'Stripe' ? 'bg-violet-500/20' : 'bg-blue-500/20'
      }`}>
        {payment.method === 'Stripe' ? '💳' : '🅿️'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{payment.memberName}</p>
        <p className="text-dark-400 text-xs">{payment.plan} • {formatDate(payment.date)}</p>
      </div>
      <div className="text-right">
        <p className="text-white font-semibold text-sm">{formatCurrency(payment.amount)}</p>
        <span className={getStatusColor(payment.status)}>
          {payment.status}
        </span>
      </div>
    </div>
  );
};

export default PaymentCard;
