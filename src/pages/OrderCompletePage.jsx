// src/pages/OrderCompletePage.jsx

import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const OrderCompletePage = ({ onClearCart }) => {
  const [status, setStatus] = useState('processing');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const clientSecret = searchParams.get('payment_intent_client_secret');
    
    // Check if we have already processed this order to prevent duplicates
    if (clientSecret && sessionStorage.getItem(clientSecret) !== 'processed') {
      // Mark this order as processed in the session
      sessionStorage.setItem(clientSecret, 'processed');

      // Now, save the order details which we'll also store in sessionStorage
      const orderDetails = JSON.parse(sessionStorage.getItem('orderDetails'));

      if (orderDetails) {
        fetch('/plantjoy/api/save-order.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...orderDetails, paymentIntentId: clientSecret })
        })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            setStatus('success');
            onClearCart(); // Clear the cart only after successful save
          } else {
            setStatus('error');
          }
        })
        .catch(() => setStatus('error'));
      }
    } else if (clientSecret) {
        // If it's already processed, just show the success message
        setStatus('success');
    } else {
      setStatus('error');
    }
  }, [searchParams, onClearCart]);

  return (
    <div className="container mx-auto px-4 py-20 text-center">
      {status === 'processing' && <h1 className="text-3xl font-bold">Processing your order...</h1>}
      {status === 'success' && (
        <>
          <h1 className="text-3xl md:text-4xl font-bold text-green-600 mb-4">Thank You!</h1>
          <p className="text-lg text-gray-700 mb-8">Your order has been placed successfully. You will receive a confirmation email shortly.</p>
          <Link to="/menu" className="bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors duration-300">
            Continue Shopping
          </Link>
        </>
      )}
      {status === 'error' && (
          <>
            <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-4">Order Error</h1>
            <p className="text-lg text-gray-700 mb-8">There was a problem saving your order. Please contact us for assistance.</p>
          </>
      )}
    </div>
  );
};

export default OrderCompletePage;