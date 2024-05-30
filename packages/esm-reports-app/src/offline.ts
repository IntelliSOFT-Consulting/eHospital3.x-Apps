import { setupDynamicOfflineDataHandler } from "@openmrs/esm-framework";

export function setupOffline() {
  setupDynamicOfflineDataHandler({
    id: "esm-reports-app",
    type: "reports",
    displayName: "Reports",
    isSynced: function (
      identifier: string,
      abortSignal?: AbortSignal
    ): Promise<boolean> {
      throw new Error("Function not implemented.");
    },
    sync: function (
      identifier: string,
      abortSignal?: AbortSignal
    ): Promise<void> {
      throw new Error("Function not implemented.");
    },
  });
}
