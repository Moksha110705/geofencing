"use client";

import * as React from "react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import type { Employee, AttendanceRecord } from "@/types";
import { Header } from "@/components/layout/header";
// Note: File names are not changed, but component names inside are.
import { AttendanceCheckForm, type AttendanceFormValues } from "@/components/geofence/location-check-form";
import { AttendanceHistory } from "@/components/geofence/breach-history";
import { checkAttendance } from "./actions";

// Mock data to simulate a database
const mockEmployees: Employee[] = [
  { id: "emp_001", name: "Alice Johnson", organization: "Innovate Inc." },
  { id: "emp_002", name: "Bob Williams", organization: "Innovate Inc." },
  { id: "emp_003", name: "Charlie Brown", organization: "Solutions Corp" },
];

export default function Home() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAttendanceCheck = async (data: AttendanceFormValues) => {
    setIsLoading(true);
    const selectedEmployee = mockEmployees.find(d => d.id === data.employeeId);
    if (!selectedEmployee) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Selected employee not found.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await checkAttendance(
        selectedEmployee.id,
        selectedEmployee.organization,
        data.ipAddress
      );

      const newRecord: AttendanceRecord = {
        ...result,
        id: `rec_${new Date().getTime()}`,
        employeeId: selectedEmployee.id,
        employeeName: selectedEmployee.name,
        organizationName: selectedEmployee.organization,
        ipAddress: data.ipAddress,
        timestamp: new Date().toISOString(),
      };
      setAttendanceRecords(prev => [newRecord, ...prev]);

      if (result.status === "present") {
        toast({
          title: "Attendance Marked: Present",
          description: result.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Attendance Marked: Absent",
          description: result.message,
        });
      }

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An unexpected error occurred",
        description:
          error instanceof Error ? error.message : "Could not check attendance. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <Header />
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline">Simulate Attendance Check</CardTitle>
                <CardDescription>
                  Manually check an employee's attendance using their IP address.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceCheckForm
                  employees={mockEmployees}
                  onSubmit={handleAttendanceCheck}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3">
            <AttendanceHistory attendanceRecords={attendanceRecords} />
          </div>
        </div>
      </main>
    </div>
  );
}
