"use server";

import { determineEntryExit, type DetermineEntryExitInput } from "@/ai/flows/determine-entry-exit";

// This is a mock perimeter for demonstration purposes.
// In a real application, this would be retrieved from a database based on the device or organization.
const MOCK_ALLOWED_PERIMETER = [
  { latitude: 34.0522, longitude: -118.2437 }, // Downtown LA
  { latitude: 34.0522, longitude: -118.2537 },
  { latitude: 34.0422, longitude: -118.2537 },
  { latitude: 34.0422, longitude: -118.2437 },
];

export async function checkDeviceLocation(
  deviceId: string,
  organizationName: string,
  latitude: number,
  longitude: number
) {
  // In a real app, you would fetch recent locations from a database.
  // Here we mock some previous locations.
  const previousLocations = [
    { latitude: 34.0520, longitude: -118.2440, timestamp: new Date(Date.now() - 60000).toISOString() },
    { latitude: 34.0521, longitude: -118.2439, timestamp: new Date(Date.now() - 120000).toISOString() },
  ];

  const input: DetermineEntryExitInput = {
    deviceId,
    organizationName,
    currentLocation: {
      latitude,
      longitude,
      timestamp: new Date().toISOString(),
    },
    previousLocations,
    allowedPerimeter: MOCK_ALLOWED_PERIMETER
  };

  try {
    const result = await determineEntryExit(input);
    return result;
  } catch (error) {
    console.error("Error in determineEntryExit flow:", error);
    throw new Error("Failed to get determination from AI model.");
  }
}
