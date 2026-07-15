import { configSchema } from './config-schema';
import { defineConfigSchema, getSyncLifecycle, registerFeatureFlag } from '@openmrs/esm-framework';
import BillingCheckInForm from './billing-form/billing-checkin-form.component';
import RequirePaymentModal from './modal/require-payment-modal.component';
import VisitAttributeTags from './invoice/payments/visit-tags/visit-attribute.component';
import DrugOrder from './billable-services/billable-item/drug-order/drug-order.component';
import LabOrder from './billable-services/billable-item/test-order/lab-order.component';
import ProcedureOrder from './billable-services/billable-item/test-order/procedure-order.component';
import PriceInfoOrder from './billable-services/billable-item/test-order/price-info-order.componet';

const moduleName = '@intellisoftkenya/esm-billing-app-extension';

const options = {
  featureName: 'billing',
  moduleName,
};

registerFeatureFlag(
  'billing',
  'Billing module',
  'This feature introduces billing extensions for clinical UI forms',
);

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

export const billingCheckInForm = getSyncLifecycle(BillingCheckInForm, options);
export const requirePaymentModal = getSyncLifecycle(RequirePaymentModal, options);
export const visitAttributeTags = getSyncLifecycle(VisitAttributeTags, options);

export const drugOrder = getSyncLifecycle(DrugOrder, options);
export const labOrder = getSyncLifecycle(LabOrder, options);
export const procedureOrder = getSyncLifecycle(ProcedureOrder, options);
export const priceInfoOrder = getSyncLifecycle(PriceInfoOrder, options);

import { customBillableServicesLeftPanelLink } from './custom-left-panel-link.component';
import appMenu from './billable-services/billable-services-menu-item/item.component';

export const billableServicesLeftPanelLink = getSyncLifecycle(customBillableServicesLeftPanelLink, options);
export const billableServicesAppMenuItem = getSyncLifecycle(appMenu, options);
