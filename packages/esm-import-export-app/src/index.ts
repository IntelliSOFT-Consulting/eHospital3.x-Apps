import { defineConfigSchema,  getSyncLifecycle, registerBreadcrumbs } from '@openmrs/esm-framework';
import { configSchema } from './config/config-schema';
import { createDashboardLink } from './components/createDashboardLink.component';
import { dashboardMeta } from './config/dashboard.meta';
import rootComponent from './parent/root.component';

import homeDashboardComponent from './views/export.component';


export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const moduleName = '@sjthc/esm-import-export-app';

const options = {
  featureName: 'esm-import-export-app',
  moduleName,
};

export const root = getSyncLifecycle(rootComponent, options);


export const importExportDashboardLink = getSyncLifecycle(createDashboardLink(dashboardMeta), options);

export const homeDashboard = getSyncLifecycle(homeDashboardComponent, options);



export function startupApp() {
  registerBreadcrumbs([]);
  defineConfigSchema(moduleName, configSchema);
}
