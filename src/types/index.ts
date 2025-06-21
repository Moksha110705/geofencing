import type { DetermineEntryExitOutput } from "@/ai/flows/determine-entry-exit";

export interface Device {
  id: string;
  name: string;
  organization: string;
}

export interface Breach extends DetermineEntryExitOutput {
  id: string;
  deviceId: string;
  deviceName: string;
  organizationName: string;
  timestamp: string;
}
