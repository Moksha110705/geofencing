import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AttendanceRecord } from "@/types";
import { ListChecks, LogIn, LogOut } from "lucide-react";
import { ClientTime } from "./client-time";

interface AttendanceHistoryProps {
  attendanceRecords: AttendanceRecord[];
}

function AttendanceEvent({ status }: { status: AttendanceRecord['status'] }) {
  if (status === "present") {
    return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800"><LogIn className="mr-1 h-3 w-3" />Present</Badge>;
  }
  return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800"><LogOut className="mr-1 h-3 w-3" />Absent</Badge>;
}

export function AttendanceHistory({ attendanceRecords }: AttendanceHistoryProps) {
  return (
    <Card className="shadow-lg h-full">
      <CardHeader>
        <CardTitle className="font-headline">Attendance History</CardTitle>
        <CardDescription>
          A real-time log of all attendance checks based on IP location.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {attendanceRecords.length > 0 ? (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                        <div className="font-medium">{record.employeeName}</div>
                        <div className="text-xs text-muted-foreground">{record.organizationName}</div>
                    </TableCell>
                    <TableCell className="text-center">
                       <AttendanceEvent status={record.status} />
                    </TableCell>
                    <TableCell className="font-mono text-xs">{record.ipAddress}</TableCell>
                    <TableCell className="text-muted-foreground">{record.message}</TableCell>
                    <TableCell className="text-right text-muted-foreground text-xs">
                      <ClientTime timestamp={record.timestamp} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
             <div className="flex justify-center mb-4">
                <div className="bg-secondary p-3 rounded-full">
                    <ListChecks className="h-8 w-8 text-muted-foreground" />
                </div>
            </div>
            <p className="font-semibold">No attendance records yet</p>
            <p className="text-sm text-muted-foreground">
              Check an employee's attendance to see the history here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
