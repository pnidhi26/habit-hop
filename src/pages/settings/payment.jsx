import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

export default function Payment() {
  // Set starter as default selected plan
  const [selectedPlan, setSelectedPlan] = useState('starter');
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = {
    free: {
      name: 'Free',
      monthly: 0,
      yearly: 0,
      features: [
        { name: 'Track up to 3 habits', included: true },
        { name: 'Basic statistics', included: true },
        { name: 'Weekly reports', included: true },
        { name: 'Mobile app access', included: true },
        { name: 'Community support', included: true },
        { name: 'Cloud sync', included: false },
        { name: 'Premium templates', included: false },
        { name: 'Advanced analytics', included: false },
        { name: 'Priority support', included: false },
        { name: 'Unlimited habits', included: false }
      ]
    },
    starter: {
      name: 'Starter',
      monthly: 4.99,
      yearly: 49.99,
      features: [
        { name: 'Track up to 10 habits', included: true },
        { name: 'Basic statistics', included: true },
        { name: 'Weekly reports', included: true },
        { name: 'Mobile app access', included: true },
        { name: 'Community support', included: true },
        { name: 'Cloud sync', included: true },
        { name: 'Premium templates', included: true },
        { name: 'Advanced analytics', included: false },
        { name: 'Priority support', included: false },
        { name: 'Unlimited habits', included: false }
      ]
    },
    pro: {
      name: 'Pro',
      monthly: 9.99,
      yearly: 99.99,
      features: [
        { name: 'Unlimited habits', included: true },
        { name: 'Basic statistics', included: true },
        { name: 'Weekly reports', included: true },
        { name: 'Mobile app access', included: true },
        { name: 'Community support', included: true },
        { name: 'Cloud sync', included: true },
        { name: 'Premium templates', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Priority support', included: true },
        { name: 'Export data in CSV/PDF', included: true }
      ]
    }
  };

  const handlePlanSelection = (plan) => {
    setSelectedPlan(plan);
  };

  const handleBillingCycleChange = (cycle) => {
    setBillingCycle(cycle);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Choose Your Plan</h1>
        <p className="text-xl text-gray-600 mb-8">Select the perfect plan for your habit tracking journey</p>
        
        {/* Billing cycle toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-200 p-1 rounded-lg inline-flex">
            <button
              onClick={() => handleBillingCycleChange('monthly')}
              className={`px-4 py-2 rounded-md ${
                billingCycle === 'monthly' ? 'bg-purple-600 text-white' : 'text-gray-700'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => handleBillingCycleChange('yearly')}
              className={`px-4 py-2 rounded-md ${
                billingCycle === 'yearly' ? 'bg-purple-600 text-white' : 'text-gray-700'
              }`}
            >
              Yearly <span className="text-sm font-medium">Save 17%</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-8 justify-center">
        {['free', 'starter', 'pro'].map((plan) => (
          <div
            key={plan}
            className={`rounded-xl shadow-lg overflow-hidden w-full max-w-sm transition-all duration-300 
              ${plan === 'starter' && selectedPlan === 'starter' ? 'bg-purple-600 text-white transform scale-105' : 'bg-white'} 
              ${selectedPlan === plan && plan !== 'starter' ? 'ring-2 ring-purple-500 transform scale-105' : ''}
            `}
          >
            <div className={`p-6 ${plan === 'starter' && selectedPlan === 'starter' ? 'bg-purple-600' : 'bg-white'}`}>
              <h2 className={`text-2xl font-bold mb-2 ${plan === 'starter' && selectedPlan === 'starter' ? 'text-white' : 'text-gray-900'}`}>
                {plans[plan].name}
              </h2>
              <div className="mb-4">
                <span className={`text-4xl font-bold ${plan === 'starter' && selectedPlan === 'starter' ? 'text-white' : 'text-gray-900'}`}>
                  ${billingCycle === 'monthly' ? plans[plan].monthly : plans[plan].yearly}
                </span>
                <span className={`ml-1 ${plan === 'starter' && selectedPlan === 'starter' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {plans[plan].monthly > 0 ? `/${billingCycle === 'monthly' ? 'mo' : 'year'}` : ''}
                </span>
              </div>
              <p className={`mb-6 ${plan === 'starter' && selectedPlan === 'starter' ? 'text-gray-300' : 'text-gray-600'}`}>
                {plan === 'free' && 'Perfect for beginners'}
                {plan === 'starter' && 'Great for committed habit builders'}
                {plan === 'pro' && 'For those serious about personal development'}
              </p>
              <button
                onClick={() => handlePlanSelection(plan)}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  selectedPlan === plan
                    ? plan === 'starter' ? 'bg-white text-black' : 'bg-purple-600 text-white'
                    : plan === 'starter' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {selectedPlan === plan ? 'Selected' : 'Select Plan'}
              </button>
            </div>
            <div className={`p-6 border-t ${
              plan === 'starter' && selectedPlan === 'starter' 
                ? 'bg-purple-900 border-gray-700' 
                : 'bg-gray-50 border-gray-100'
            }`}>
              <h3 className={`font-semibold mb-4 ${
                plan === 'starter' && selectedPlan === 'starter' ? 'text-white' : 'text-gray-900'
              }`}>Features</h3>
              <ul className="space-y-3">
                {plans[plan].features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    {feature.included ? (
                      <Check className={`h-5 w-5 mr-2 mt-0.5 flex-shrink-0 ${
                        plan === 'starter' && selectedPlan === 'starter' ? 'text-green-400' : 'text-green-500'
                      }`} />
                    ) : (
                      <X className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                    )}
                    <span className={
                      feature.included 
                        ? (plan === 'starter' && selectedPlan === 'starter' ? 'text-white' : 'text-gray-900')
                        : 'text-gray-400'
                    }>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {selectedPlan !== 'free' && (
        <div className="mt-12 bg-white shadow-md rounded-lg p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Payment Details</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Information</label>
              <div className="border border-gray-300 rounded-md px-3 py-2">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    className="w-full border-none outline-none"
                    placeholder="1234 5678 9012 3456"
                  />
                  <div className="flex gap-1">
                    <div className="h-6 w-10 bg-gray-200 rounded"></div>
                    <div className="h-6 w-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="123"
                />
              </div>
            </div>
            <button className="w-full bg-purple-600 text-white py-3 rounded-md font-medium mt-6 hover:bg-purple-700 transition-colors">
              Subscribe to {plans[selectedPlan].name} (
              ${billingCycle === 'monthly' ? plans[selectedPlan].monthly : plans[selectedPlan].yearly}/
              {billingCycle === 'monthly' ? 'month' : 'year'})
            </button>
            <p className="text-sm text-gray-500 text-center mt-2">
              You can cancel your subscription anytime
            </p>
          </div>
        </div>
      )}

      <div className="mt-12 text-center text-gray-600">
        <p className="mb-2">Have questions about our plans?</p>
        <button className="text-purple-600 font-medium hover:underline">Contact our support team</button>
      </div>
    </div>
  );
}