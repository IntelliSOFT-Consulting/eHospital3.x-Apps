import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigurableLink } from '@openmrs/esm-framework';

export function CustomLeftPanelLink() {
  return (
    <ConfigurableLink
      to={`${window.getOpenmrsSpaBase()}billable-services`}
      className="cds--side-nav__link">
      Billable Services
    </ConfigurableLink>
  );
}

export const customBillableServicesLeftPanelLink = () => (
  <BrowserRouter>
    <CustomLeftPanelLink />
  </BrowserRouter>
);
