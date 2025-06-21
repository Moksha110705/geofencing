
export interface CheckLocationResult {
  breachType: "exit" | "none";
  alertMessage: string;
}

export interface Device {
  id: string;
  name: string;
  organization: string;
}

export interface Breach extends CheckLocationResult {
  id: string;
  deviceId: string;
  deviceName: string;
  organizationName: string;
  timestamp: string;
}
