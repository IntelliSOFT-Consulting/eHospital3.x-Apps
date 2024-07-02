import { defineConfigSchema, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import NavbarActionButton from './navbar/navbar-action-button.component';

const moduleName = '@kenyaemr/esm-nav-app';

const options = {
  featureName: 'patient-flags',
  moduleName,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');
export const navbarButtons = getSyncLifecycle(NavbarActionButton, options);

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}
