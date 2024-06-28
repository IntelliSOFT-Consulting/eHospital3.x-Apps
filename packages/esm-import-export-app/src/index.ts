import { defineConfigSchema,  getSyncLifecycle, registerBreadcrumbs } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import { createDashboardLink } from './createDashboardLink.component';
import { dashboardMeta } from './dashboard.meta';
import rootComponent from './root.component';

import homeDashboardComponent from './home.component';


export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const moduleName = '@sjthc/esm-service-queues-app';

const options = {
  featureName: 'outpatient',
  moduleName,
};

export const root = getSyncLifecycle(rootComponent, options);


export const serviceQueuesDashboardLink = getSyncLifecycle(createDashboardLink(dashboardMeta), options);

export const homeDashboard = getSyncLifecycle(homeDashboardComponent, options);



export function startupApp() {
  registerBreadcrumbs([]);
  defineConfigSchema(moduleName, configSchema);
}
