import { configSchema } from './config-schema';
import { createDashboardLink } from '@openmrs/esm-patient-common-lib';
import { createLeftPanelLink } from './left-panel-link.component';
import { dashboardMeta } from './dashboard.meta';
import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle, registerFeatureFlag } from '@openmrs/esm-framework';
import BillableServiceHome from './billable-services/billable-services-home.component';
import BillableServicesCardLink from './billable-services-admin-card-link.component';
import BillHistory from './bill-history/bill-history.component';
import BillingCheckInForm from './billing-form/billing-checkin-form.component';
import RequirePaymentModal from './modal/require-payment-modal.component';
import RootComponent from './root.component';
import VisitAttributeTags from './invoice/payments/visit-tags/visit-attribute.component';
import ServiceMetrics from './billable-services/dashboard/service-metrics.component';
import appMenu from './billable-services/billable-services-menu-item/item.component';

import DrugOrder from './billable-services/billable-item/drug-order/drug-order.component';
import LabOrder from './billable-services/billable-item/test-order/lab-order.component';
import ProcedureOrder from './billable-services/billable-item/test-order/procedure-order.component';
import PriceInfoOrder from './billable-services/billable-item/test-order/price-info-order.componet';

import { BulkImportBillableServices } from './billable-services/bulk-import-billable-service.modal';

import { CreatePaymentPoint } from './payment-points/create-payment-point.component';
import { ClockIn } from './payment-points/payment-point/clock-in.component';
import { ClockOut } from './payment-points/payment-point/clock-out.component';

const moduleName = '@ehospital/esm-billing-app';

const options = {
  featureName: 'billing',
  moduleName,
};

registerFeatureFlag(
  'billing',
  'Billing module',
  'This feature introduces navigation links on the patient chart and home page to allow accessing the billing module features',
);

export const billingDashboardLink = getSyncLifecycle(
  createLeftPanelLink({
    name: 'billing',
    title: 'Billing Overview',
  }),
  options,
);

export const chargeItemsPanelLink = getSyncLifecycle(
  createLeftPanelLink({
    name: 'charge-items',
    title: 'Charge Items',
  }),
  options,
);

export const paymentHistoryPanelLink = getSyncLifecycle(
  createLeftPanelLink({
    name: 'payment-history',
    title: 'Payment History',
  }),
  options,
);

export const paymentPointsPanelLink = getSyncLifecycle(
  createLeftPanelLink({
    name: 'payment-point',
    title: 'Payment Points',
  }),
  options,
);

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

export const billingSummaryDashboardLink = getSyncLifecycle(
  createDashboardLink({ ...dashboardMeta, moduleName }),
  options,
);

export const billableServicesCardLink = getSyncLifecycle(BillableServicesCardLink, options);
export const billableServicesHome = getSyncLifecycle(BillableServiceHome, options);
export const billingCheckInForm = getSyncLifecycle(BillingCheckInForm, options);
export const serviceMetrics = getSyncLifecycle(ServiceMetrics, options);
export const billingPatientSummary = getSyncLifecycle(BillHistory, options);
export const requirePaymentModal = getSyncLifecycle(RequirePaymentModal, options);
export const root = getSyncLifecycle(RootComponent, options);
export const visitAttributeTags = getSyncLifecycle(VisitAttributeTags, options);
export const billableServicesAppMenuItem = getSyncLifecycle(appMenu, options);

export const createPaymentPoint = getSyncLifecycle(CreatePaymentPoint, options);

export const drugOrder = getSyncLifecycle(DrugOrder, options);
export const labOrder = getSyncLifecycle(LabOrder, options);
export const procedureOrder = getSyncLifecycle(ProcedureOrder, options);
export const priceInfoOrder = getSyncLifecycle(PriceInfoOrder, options);

export const bulkImportBillableServicesModal = getSyncLifecycle(BulkImportBillableServices, options);
export const clockInModal = getSyncLifecycle(ClockIn, options)
export const clockOut = getSyncLifecycle(ClockOut, options)

export const editBillLineItemDialog = getAsyncLifecycle(() => import('./bill-item-actions/edit-bill-item.component'), {
  featureName: 'edit bill line item',
  moduleName,
});

// t('billingForm', 'Billing form')
export const billingFormWorkspace = getAsyncLifecycle(() => import('./billing-form/billing-form.component'), options);
