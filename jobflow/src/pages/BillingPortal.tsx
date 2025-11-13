import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Download, Edit, Shield, AlertCircle, Check, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
}

export default function BillingPortal() {
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Mock data - replace with actual Stripe data
  const currentPlan = {
    name: 'Pro Plan',
    price: 29.99,
    interval: 'month',
    nextBillingDate: '2025-12-13',
    status: 'active'
  };

  const paymentMethod = {
    brand: 'Visa',
    last4: '4242',
    expMonth: 12,
    expYear: 2026
  };

  const billingAddress = {
    name: 'John Doe',
    line1: '123 Career Street',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94102',
    country: 'US'
  };

  const invoices: Invoice[] = [
    { id: 'inv_001', date: '2025-11-13', amount: 29.99, status: 'paid' },
    { id: 'inv_002', date: '2025-10-13', amount: 29.99, status: 'paid' },
    { id: 'inv_003', date: '2025-09-13', amount: 29.99, status: 'paid' }
  ];

  const handleDownloadInvoice = (invoiceId: string) => {
    // TODO: Implement PDF download via Stripe API
    console.log('Downloading invoice:', invoiceId);
    alert('Invoice PDF will be downloaded');
  };

  const handleUpdatePaymentMethod = () => {
    // TODO: Implement Stripe payment method update
    console.log('Update payment method');
    alert('Redirecting to Stripe payment method update');
  };

  const handleUpdateBillingAddress = () => {
    // TODO: Implement billing address update
    console.log('Update billing address');
    alert('Update billing address form would appear here');
  };

  const handleChangePlan = () => {
    // TODO: Implement plan change via Stripe
    console.log('Change plan');
    alert('Redirecting to plan selection');
  };

  const handleCancelSubscription = () => {
    // TODO: Implement subscription cancellation via Stripe
    console.log('Cancel subscription');
    setShowCancelModal(false);
    alert('Subscription will be cancelled at the end of the billing period');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {/* Back Link */}
        <Link
          to="/settings"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Settings
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Billing & Subscription</h1>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Shield className="w-4 h-4" />
              <span>Secure Payments by Stripe</span>
            </div>
          </div>
        </div>

        {/* Current Plan */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Current Plan</h2>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold">{currentPlan.name}</h3>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Active
                  </span>
                </div>
                <p className="text-gray-400 text-lg mb-1">
                  ${currentPlan.price}/{currentPlan.interval}
                </p>
                <p className="text-gray-400 text-sm">
                  Next billing date: {new Date(currentPlan.nextBillingDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <button
                onClick={handleChangePlan}
                className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition"
              >
                Change Plan
              </button>
            </div>
          </div>
        </section>

        {/* Payment Method & Billing Address */}
        <section className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Payment Method */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 h-full flex flex-col justify-between">
              <div className="flex items-start gap-4 mb-4">
                <CreditCard className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="font-semibold mb-1">
                    {paymentMethod.brand} ending in {paymentMethod.last4}
                  </p>
                  <p className="text-sm text-gray-400">
                    Expires {paymentMethod.expMonth}/{paymentMethod.expYear}
                  </p>
                </div>
              </div>
              <button
                onClick={handleUpdatePaymentMethod}
                className="w-full md:w-auto px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center gap-2 transition"
              >
                <Edit className="w-4 h-4" />
                Update Payment Method
              </button>
            </div>
          </div>

          {/* Billing Address */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Billing Address</h2>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 h-full flex flex-col justify-between">
              <div className="mb-4">
                <p className="font-semibold mb-2">{billingAddress.name}</p>
                <p className="text-sm text-gray-400">
                  {billingAddress.line1}<br />
                  {billingAddress.city}, {billingAddress.state} {billingAddress.postalCode}<br />
                  {billingAddress.country}
                </p>
              </div>
              <button
                onClick={handleUpdateBillingAddress}
                className="w-full md:w-auto px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center gap-2 transition"
              >
                <Edit className="w-4 h-4" />
                Edit Information
              </button>
            </div>
          </div>
        </section>

        {/* Invoice History */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Invoice History</h2>
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-750">
                  <tr className="border-b border-gray-700">
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Status</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-400">Download</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-750 transition">
                      <td className="px-6 py-4 text-sm">
                        {new Date(invoice.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm">${invoice.amount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          invoice.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                          invoice.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDownloadInvoice(invoice.id)}
                          className="inline-flex items-center gap-1.5 text-yellow-500 hover:text-yellow-400 font-medium text-sm transition"
                        >
                          <Download className="w-4 h-4" />
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Subscription Management */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Subscription Management</h2>
          <div className="bg-gray-800 border border-red-500/30 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold mb-2">Cancel Subscription</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Cancelling will downgrade you to the free plan at the end of your current billing cycle
                  ({new Date(currentPlan.nextBillingDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}). You'll lose access to premium features but your data will be preserved.
                </p>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="px-6 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-lg font-medium transition"
                >
                  Cancel Subscription
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Confirm Cancellation</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to cancel your subscription? You'll continue to have access until
              {' '}{new Date(currentPlan.nextBillingDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition"
              >
                Cancel Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
