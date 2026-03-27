import React, { useState } from 'react';
import { mockSubscriptionPlans } from '../../data/staticData';
import { formatCurrency } from '../../utils/helpers';
import PaymentModal from './PaymentModal'; // Import the new modal

const SubscriptionPlan = ({ onSelect }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockSubscriptionPlans.map((plan) => (
          <div
            key={plan.id}
            className={`glass-card-hover relative overflow-hidden ${
              plan.popular ? 'ring-2 ring-primary-500 shadow-glow' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-gradient-to-l from-primary-500 to-accent-emerald text-white text-xs font-bold px-4 py-1 rounded-bl-xl">
                POPULAR
              </div>
            )}
            <div className={`h-1.5 bg-gradient-to-r ${plan.color}`}></div>
            <div className="p-8 text-center flex flex-col h-full">
              <h3 className="text-xl font-display font-bold text-white">{plan.name}</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-display font-bold gradient-text">
                  {formatCurrency(plan.price)}
                </span>
                <span className="text-dark-400 text-sm">/{plan.period}</span>
              </div>

              <div className="space-y-3 mb-8 flex-1 text-left">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-dark-300">
                    <svg className="w-5 h-5 mt-0.5 text-primary-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleSelectPlan(plan)}
                className={`w-full py-3 rounded-xl font-medium transition-all duration-300 mt-auto ${
                  plan.popular
                    ? 'btn-primary'
                    : 'bg-white/5 text-white hover:bg-primary-500/10 hover:text-primary-400'
                }`}
              >
                Choose {plan.name}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Render the Checkout Modal */}
      {selectedPlan && (
        <PaymentModal 
          plan={selectedPlan} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
};

export default SubscriptionPlan;

