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
import type { Breach } from "@/types";
import { AlertTriangle, ListChecks, LogIn, LogOut } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface BreachHistoryProps {
  breaches: Breach[];
}

function BreachEvent({ breachType }: { breachType: Breach['breachType'] }) {
  if (breachType === "entry") {
    return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800"><LogIn className="mr-1 h-3 w-3" />Entry</Badge>;
  }
  if (breachType === "exit") {
    return <Badge variant="destructive" className="bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-800"><LogOut className="mr-1 h-3 w-3" />Exit</Badge>;
  }
  return null;
}

export function BreachHistory({ breaches }: BreachHistoryProps) {
  return (
    <Card className="shadow-lg h-full">
      <CardHeader>
        <CardTitle className="font-headline">Attendance & Breach History</CardTitle>
        <CardDescription>
          A real-time log of all detected entry and exit events.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {breaches.length > 0 ? (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Organization</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead className="text-center">Event</TableHead>
                  <TableHead>Alert Message</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {breaches.map((breach) => (
                  <TableRow key={breach.id}>
                    <TableCell className="font-medium">{breach.organizationName}</TableCell>
                    <TableCell>{breach.deviceName}</TableCell>
                    <TableCell className="text-center">
                       <BreachEvent breachType={breach.breachType} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{breach.alertMessage}</TableCell>
                    <TableCell className="text-right text-muted-foreground text-xs">
                      {formatDistanceToNow(new Date(breach.timestamp), { addSuffix: true })}
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
            <p className="font-semibold">No events yet</p>
            <p className="text-sm text-muted-foreground">
              Trigger a location check to see the history here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
