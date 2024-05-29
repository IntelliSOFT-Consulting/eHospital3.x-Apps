import {
  defineConfigSchema,
  getAsyncLifecycle,
  getSyncLifecycle,
} from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";
import { createDashboardLink } from "./createDashboardLink.component";
import { dashboardMeta } from "./dashboard.meta";
import { setupOffline } from "./offline";
import rootComponent from "./root.component";

const moduleName = "@sjthc/esm-reports-app";

const options = {
  featureName: "reports",
  moduleName,
};

export const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

export function startupApp() {
  setupOffline();
  defineConfigSchema(moduleName, configSchema);
}

export const root = getSyncLifecycle(rootComponent, options);

export const reportsDashboardLink = getSyncLifecycle(
  createDashboardLink(dashboardMeta),
  options
);
