import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle } from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";
import AiModelActionButton from "./ai-model-action-button/ai-model-action-button.extension";

const moduleName = "@ehospital/esm-ai-model-app";

const options = {
  featureName: "ai-model",
  moduleName,
};

export const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);
// export const navbarButtons = getSyncLifecycle(NavbarActionButton, options);

// export const patientFlag = getSyncLifecycle(patientFlagsComponent, options);

export const aiModelWorkspace = getAsyncLifecycle(() => import("./ai-model/ai-model.workspace"), options);

export const aiModelLaunchButton = getSyncLifecycle(AiModelActionButton, options);

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}
