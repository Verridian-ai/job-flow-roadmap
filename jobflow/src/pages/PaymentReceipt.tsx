import { useParams, Link } from 'react-router-dom';
import { Download, ArrowLeft, Check, CreditCard, Calendar, Receipt } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function PaymentReceipt() {
  const { receiptId } = useParams();

  // Mock receipt data - replace with actual Stripe data
  const receipt = {
    id: receiptId || 'rec_123456',
    invoiceNumber: 'INV-2025-001',
    date: '2025-11-13',
    paidDate: '2025-11-13',
    status: 'paid',
    customer: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      address: '123 Career Street, San Francisco, CA 94102'
    },
    items: [
      {
        description: 'Pro Plan - Monthly Subscription',
        period: 'Nov 13, 2025 - Dec 13, 2025',
        quantity: 1,
        unitPrice: 29.99,
        total: 29.99
      }
    ],
    subtotal: 29.99,
    tax: 0,
    total: 29.99,
    paymentMethod: {
      brand: 'Visa',
      last4: '4242'
    },
    company: {
      name: 'Jobflow Inc.',
      address: '456 Business Ave, San Francisco, CA 94103',
      email: 'billing@jobflow.com',
      taxId: 'TAX-123-456'
    }
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF generation and download
    console.log('Downloading PDF for receipt:', receipt.id);
    alert('PDF download would start here. Implement using jsPDF or similar library.');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="print:hidden">
        <Navbar />
      </div>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Back Link & Actions */}
        <div className="print:hidden mb-6 flex items-center justify-between">
          <Link
            to="/billing"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Billing
          </Link>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Print
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Receipt */}
        <div className="bg-white text-gray-900 rounded-lg shadow-xl p-8 md:p-12 print:shadow-none print:p-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-8 pb-8 border-b border-gray-200">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Receipt</h1>
              <p className="text-gray-600">Receipt #{receipt.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-2 mb-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-600">PAID</span>
              </div>
              <p className="text-sm text-gray-600">
                Date: {new Date(receipt.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Company & Customer Info */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                From
              </h3>
              <div className="text-sm text-gray-600">
                <p className="font-semibold text-gray-900">{receipt.company.name}</p>
                <p>{receipt.company.address}</p>
                <p>{receipt.company.email}</p>
                <p className="mt-2">Tax ID: {receipt.company.taxId}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Bill To</h3>
              <div className="text-sm text-gray-600">
                <p className="font-semibold text-gray-900">{receipt.customer.name}</p>
                <p>{receipt.customer.email}</p>
                <p className="mt-2">{receipt.customer.address}</p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Details
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Paid with {receipt.paymentMethod.brand} ending in {receipt.paymentMethod.last4}</span>
              <span>•</span>
              <span>
                {new Date(receipt.paidDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* Line Items */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-3 text-sm font-semibold text-gray-900">Description</th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-900">Qty</th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-900">Unit Price</th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-900">Amount</th>
                </tr>
              </thead>
              <tbody>
                {receipt.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-4">
                      <div>
                        <p className="font-medium text-gray-900">{item.description}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          {item.period}
                        </p>
                      </div>
                    </td>
                    <td className="text-right py-4 text-gray-600">{item.quantity}</td>
                    <td className="text-right py-4 text-gray-600">${item.unitPrice.toFixed(2)}</td>
                    <td className="text-right py-4 font-medium text-gray-900">${item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-full max-w-xs">
              <div className="flex justify-between py-2 text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">${receipt.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium text-gray-900">${receipt.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 text-lg font-bold border-t-2 border-gray-300 mt-2">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">${receipt.total.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-end gap-2 text-sm text-green-600 font-semibold mt-2">
                <Check className="w-4 h-4" />
                Amount Paid
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Thank you for your business!
            </p>
            <p className="text-xs text-gray-500">
              Questions? Contact us at {receipt.company.email}
            </p>
          </div>

          {/* Print-only Footer */}
          <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-xs text-gray-500 text-center">
            <p>This is an automatically generated receipt.</p>
            <p>Receipt ID: {receipt.id}</p>
          </div>
        </div>

        {/* Additional Info (not printed) */}
        <div className="print:hidden mt-6 text-center text-sm text-gray-400">
          <p>
            This receipt is for your records. For questions about your subscription or billing,
            {' '}<Link to="/billing" className="text-yellow-500 hover:text-yellow-400">visit your billing portal</Link>
            {' '}or <Link to="/help" className="text-yellow-500 hover:text-yellow-400">contact support</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
