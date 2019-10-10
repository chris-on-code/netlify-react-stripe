import React from 'react';
import axios from 'axios';
import { injectStripe, Elements, CardElement } from 'react-stripe-elements';
import { useIdentityContext } from 'react-netlify-identity-widget';

function PaymentForm({ stripe }) {
  const { user } = useIdentityContext();

  async function handleSubmit(e) {
    e.preventDefault();

    // create a payment method
    const token = await stripe.createToken();

    // make call to api to charge customer
    try {
      console.log('what', token, token.id, token.token.id);

      const response = await axios.post(
        '/.netlify/functions/subscription-create',
        {
          message: 'hello',
          token: token.token.id,
          boo: 'other stuff'
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token.access_token}`
          }
        }
      );

      const data = await response.json();

      console.log({ data });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      payment form goes here
      <CardElement />
      <button>Do It</button>
    </form>
  );
}

// gotta wrap with injectStripe
const StripePaymentForm = injectStripe(PaymentForm);

// wrap it all with <Elements />. can only use injectStripe under <Elements />
export default () => (
  <Elements>
    <StripePaymentForm />
  </Elements>
);
