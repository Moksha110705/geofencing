"use server";

import type { CheckLocationResult } from "@/types";

// This is a mock perimeter for demonstration purposes.
// In a real application, this would be retrieved from a database based on the device or organization.
// It defines a simple rectangle around Downtown LA.
const MOCK_ALLOWED_PERIMETER = [
  { latitude: 34.0522, longitude: -118.2437 }, // NE
  { latitude: 34.0522, longitude: -118.2537 }, // NW
  { latitude: 34.0422, longitude: -118.2537 }, // SW
  { latitude: 34.0422, longitude: -118.2437 }, // SE
];

export async function checkDeviceLocation(
  deviceId: string,
  organizationName: string,
  latitude: number,
  longitude: number
): Promise<CheckLocationResult> {
  // For a simple rectangle, find the min/max lat/lon.
  const lats = MOCK_ALLOWED_PERIMETER.map(p => p.latitude);
  const lons = MOCK_ALLOWED_PERIMETER.map(p => p.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);

  const isInside =
    latitude >= minLat &&
    latitude <= maxLat &&
    longitude >= minLon &&
    longitude <= maxLon;

  if (isInside) {
    return {
      breachType: "none",
      alertMessage: "Device is within the designated perimeter. No breach detected.",
    };
  } else {
    return {
      breachType: "exit",
      alertMessage: "Device has exited the allowed perimeter.",
    };
  }
}
