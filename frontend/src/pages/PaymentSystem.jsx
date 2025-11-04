import React, { useState } from 'react'
import Navbar from '../components/Navbar'

const PaymentSystem = () => {
  const [paymentHistory, setPaymentHistory] = useState([
    { id: 1, date: '2024-01-01', amount: 1200, method: 'Credit Card', status: 'Completed' },
    { id: 2, date: '2023-12-01', amount: 1200, method: 'Bank Transfer', status: 'Completed' },
    { id: 3, date: '2023-11-01', amount: 1200, method: 'Credit Card', status: 'Completed' }
  ])

  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('credit-card')

  const handlePayment = (e) => {
    e.preventDefault()
    // Simulate payment processing
    alert('Payment processed successfully!')
    setShowPaymentModal(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment System</h1>
          <p className="text-gray-600">Manage your rent payments and payment history</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Balance */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Balance</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">$1,200.00</p>
                  <p className="text-gray-600">Due by January 15, 2024</p>
                </div>
                <button 
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition duration-200"
                >
                  Pay Now
                </button>
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Payment History</h3>
              </div>
              <div className="p-6">
                {paymentHistory.length > 0 ? (
                  <div className="space-y-4">
                    {paymentHistory.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Rent Payment</p>
                          <p className="text-sm text-gray-500">{payment.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${payment.amount}</p>
                          <p className="text-sm text-gray-500">{payment.method}</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          {payment.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No payment history found</p>
                )}
              </div>
            </div>
          </div>

          {/* Payment Methods & Info */}
          <div className="space-y-6">
            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">C</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Credit Card</p>
                      <p className="text-sm text-gray-500">**** 1234</p>
                    </div>
                  </div>
                  <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                    Edit
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold text-sm">B</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Bank Account</p>
                      <p className="text-sm text-gray-500">**** 5678</p>
                    </div>
                  </div>
                  <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                    Edit
                  </button>
                </div>
                <button className="w-full text-center p-3 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition duration-200">
                  + Add Payment Method
                </button>
              </div>
            </div>

            {/* Support */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
                  <div className="font-medium text-gray-900">Payment Issues</div>
                  <div className="text-sm text-gray-600">Troubleshoot payment problems</div>
                </button>
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
                  <div className="font-medium text-gray-900">Contact Support</div>
                  <div className="text-sm text-gray-600">Get help from our team</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Make Payment</h3>
              </div>
              <form onSubmit={handlePayment} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      value="1,200.00"
                      readOnly
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit-card"
                        checked={paymentMethod === 'credit-card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Credit Card</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank-transfer"
                        checked={paymentMethod === 'bank-transfer'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Bank Transfer</span>
                    </label>
                  </div>
                </div>

                {paymentMethod === 'credit-card' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-400 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-md font-medium hover:bg-emerald-700 transition duration-200"
                  >
                    Pay $1,200.00
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentSystem