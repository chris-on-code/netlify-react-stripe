import React from 'react';
import SiteLayout from './layouts/site/SiteLayout';
import PaymentForm from './components/PaymentForm';

export default function App() {
  return (
    <SiteLayout>
      stuff goes here
      <PaymentForm />
    </SiteLayout>
  );
}
