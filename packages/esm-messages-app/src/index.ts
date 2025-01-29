import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle } from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";
import RootComponent from "./root.component";
import { createDashboardLink } from "@openmrs/esm-patient-common-lib";
import { createLeftPanelLink } from "./left-panel-link.component";

const moduleName = "@ehospital/esm-messages-app";

const options = {
  featureName: "messages-dashboard",
  moduleName,
};

export const messagesDashboardOverviewLink = getSyncLifecycle(
  createLeftPanelLink({
    name: "messages",
    title: "Messages Dashboard",
  }),
  options
)

export const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

export const root = getSyncLifecycle(RootComponent, options);

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}
