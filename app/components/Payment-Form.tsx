'use client'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      // CardElement has not been mounted.
      return;
    }

    // Proceed with payment processing
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || !elements}>
        Pay
      </button>
    </form>
  );
}

export default PaymentForm;