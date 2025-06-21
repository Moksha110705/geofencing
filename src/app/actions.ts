"use server";

import type { AttendanceResult } from "@/types";

// Mock database for organization's required locations
const MOCK_ORGANIZATION_LOCATION: Record<string, string> = {
  "Innovate Inc.": "New York",
  "Solutions Corp": "San Francisco",
};

// Mock IP-to-Location service
const MOCK_IP_TO_LOCATION: Record<string, string> = {
  "8.8.8.8": "New York", // Google DNS in NY
  "1.1.1.1": "San Francisco", // Cloudflare DNS in SF
  "208.67.222.222": "London", // OpenDNS
  "104.16.132.229": "San Francisco", // Example of a website IP
};

export async function checkAttendance(
  employeeId: string,
  organizationName: string,
  ipAddress: string
): Promise<AttendanceResult> {

  const requiredLocation = MOCK_ORGANIZATION_LOCATION[organizationName];
  const ipLocation = MOCK_IP_TO_LOCATION[ipAddress];

  if (!requiredLocation) {
    return {
      status: "absent",
      message: `Organization '${organizationName}' has no location assigned.`,
    };
  }

  if (!ipLocation) {
    return {
      status: "absent",
      message: `Could not determine location for IP address: ${ipAddress}.`,
    };
  }
  
  const isPresent = ipLocation === requiredLocation;

  if (isPresent) {
    return {
      status: "present",
      message: `Attendance confirmed for ${employeeId} from IP at '${ipLocation}'.`,
    };
  } else {
    return {
      status: "absent",
      message: `Employee IP is at '${ipLocation}', but required location is '${requiredLocation}'.`,
    };
  }
}
