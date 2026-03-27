import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { formatCurrency } from '../../utils/helpers';

// Initialize Stripe outside component to avoid recreation
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_placeholder_key_replace_me');

const CheckoutForm = ({ plan, onCancel, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    // Simulate network latency for mock payment
    setTimeout(async () => {
      const cardElement = elements.getElement(CardElement);

      // In a real app we'd call our backend to create a PaymentIntent and pass the secret here
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (paymentMethodError) {
        setError(paymentMethodError.message);
        setProcessing(false);
      } else {
        // Success Mock
        setSuccess(true);
        setProcessing(false);
        setTimeout(() => onSuccess(plan), 2000);
      }
    }, 1500);
  };

  if (success) {
    return (
      <div className="text-center py-8 animate-fade-in">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 text-emerald-400">
          ✓
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
        <p className="text-dark-400 mb-6">You are now subscribed to the {plan.name} plan.</p>
        <p className="text-sm text-dark-500 animate-pulse">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-dark-900 rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-dark-300 font-medium">Plan:</span>
          <span className="text-white font-bold">{plan.name}</span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-4">
          <span className="text-dark-300 font-medium">Billing Cycle:</span>
          <span className="text-white capitalize">Monthly</span>
        </div>
        <div className="flex justify-between items-center text-lg">
          <span className="text-white font-bold">Total Due:</span>
          <span className="text-primary-400 font-bold">{formatCurrency(plan.price)}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-300 mb-2">Card Information</label>
        <div className="p-4 bg-dark-900 border border-white/10 rounded-xl">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#ffffff',
                  '::placeholder': {
                    color: '#888888',
                  },
                },
                invalid: {
                  color: '#ef4444',
                },
              },
              hidePostalCode: true
            }} 
          />
        </div>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="flex-1 py-3 px-4 rounded-xl border-2 border-dark-600 text-dark-300 font-semibold hover:border-dark-400 hover:text-white transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {processing ? (
            <>
              <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            `Pay ${formatCurrency(plan.price)}`
          )}
        </button>
      </div>
    </form>
  );
};

const PaymentModal = ({ plan, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="glass-card relative w-full max-w-md p-6 sm:p-8 animate-slide-up z-10 border border-white/10 shadow-glow-lg">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-dark-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-2xl font-display font-bold text-white mb-6">Complete Checkout</h2>
        
        <Elements stripe={stripePromise}>
          <CheckoutForm plan={plan} onCancel={onClose} onSuccess={(plan) => {
             console.log("Subscribed to:", plan.name);
             onClose();
          }} />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentModal;
