import React from 'react';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

export default function SiteLayout({ children }) {
  return (
    <div>
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
