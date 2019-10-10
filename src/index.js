import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { IdentityContextProvider } from 'react-netlify-identity-widget';
import { StripeProvider } from 'react-stripe-elements';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <IdentityContextProvider url={'https://netlify-react-stripe.netlify.com'}>
    <StripeProvider apiKey="pk_test_mOR8RSJfQqdPHb8y5LRSgBq300JVL2F8x0">
      <App />
    </StripeProvider>
  </IdentityContextProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
