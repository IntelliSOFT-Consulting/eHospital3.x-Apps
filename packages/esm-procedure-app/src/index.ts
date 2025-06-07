import { getAsyncLifecycle, defineConfigSchema, getSyncLifecycle, translateFrom } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import { createLeftPanelLink } from './left-panel-link';
import workListProcedures from './procedure-tabs/work-list-tab.component';
import referredProcedures from './procedure-tabs/referred-tab.component';
import completedProcedures from './procedure-tabs/completed-tab.component';
import notDoneProcedures from './procedure-tabs/not-done-tab.component';
import addProcedureToWorklistDialog from './procedures-ordered/pick-procedure-order/add-to-worklist-dialog.component';
import procedureInstructionsModal from './procedures-ordered/procedure-instructions/procedure-instructions.component';
import ProceduresOrderBasketPanelExtension from './form/procedures-orders/procedures-order-basket-panel/procedures-order-basket-panel.extension';
import rejectProcedureOrderDialog from './procedures-ordered/reject-order-dialog/reject-procedure-order-dialog.component';
import procedureRejectReasonModal from './procedures-ordered/reject-reason/procedure-reject-reason.component';
import PostProcedureForm from './form/post-procedures/post-procedure-form.component';
import PrintPreviewModal from './print/print-procedure-results.component';

const moduleName = "@ehospital/esm-procedure-app";

const options = {
  featureName: "ehospital/esm-procedure-app",
  moduleName,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

export const root = getAsyncLifecycle(() => import('./root.component'), options);

export const procedureDashboardLink = getSyncLifecycle(
  createLeftPanelLink({
    name: 'procedure',
    title: 'Procedures',
  }),
  options,
);

// Modals
export const rejectProcedureOrderDialogComponent = getSyncLifecycle(rejectProcedureOrderDialog, options);

export const worklistProceduresTabComponent = getSyncLifecycle(workListProcedures, options);

export const referredProceduresTabComponent = getSyncLifecycle(referredProcedures, options);
export const completedProceduresTabComponent = getSyncLifecycle(completedProcedures, options);
export const notDoneProceduresTabComponent = getSyncLifecycle(notDoneProcedures, options);
export const procedureInstructionsModalComponent = getSyncLifecycle(procedureInstructionsModal, options);
export const procedureRejectModalComponent = getSyncLifecycle(procedureRejectReasonModal, options);
export const addProcedureToWorklistDialogComponent = getSyncLifecycle(addProcedureToWorklistDialog, options);

export const proceduresOrderPanel = getSyncLifecycle(ProceduresOrderBasketPanelExtension, options);
export const postProcedureResults = getSyncLifecycle(PostProcedureForm, options);
export const printProcedureReportModal = getSyncLifecycle(PrintPreviewModal, options);

// t('addProcedureOrderWorkspaceTitle', 'Add procedure order')
export const addProceduresOrderWorkspace = getAsyncLifecycle(
  () => import('./form/procedures-orders/add-procedures-order/add-procedures-order.workspace'),
  options,
);
