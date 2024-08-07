import {
  defineConfigSchema,
  getAsyncLifecycle,
  getSyncLifecycle,
} from "@openmrs/esm-framework";
import { moduleName } from "./constants";
import { configSchema } from "./config-schema";
import { homeVisitsDashboardMeta } from "./dashboard.meta";
import { createVisitsDashboardLink as createVisitsHomeDashboardLink } from "./DashboardLink";

const options = {
  featureName: "esm-patient-visit-report-app",
  moduleName,
};

export const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

export const rootHome = getAsyncLifecycle(
  () => import("./root.component"),
  options
);

export const homeTodayVisitsLink = getSyncLifecycle(
  createVisitsHomeDashboardLink(homeVisitsDashboardMeta),
  options
);
