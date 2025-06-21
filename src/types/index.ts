
export interface AttendanceResult {
  status: "present" | "absent";
  message: string;
}

export interface Employee {
  id: string;
  name: string;
  organization: string;
}

export interface AttendanceRecord extends AttendanceResult {
  id: string;
  employeeId: string;
  employeeName: string;
  organizationName: string;
  ipAddress: string;
  timestamp: string;
}
