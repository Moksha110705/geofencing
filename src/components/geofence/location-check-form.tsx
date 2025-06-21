"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Building, Loader2, Server, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Employee } from "@/types";

const formSchema = z.object({
  employeeId: z.string({ required_error: "Please select an employee." }),
  ipAddress: z.string().ip({ message: "Please enter a valid IP address." }),
});

export type AttendanceFormValues = z.infer<typeof formSchema>;

interface AttendanceCheckFormProps {
  employees: Employee[];
  onSubmit: (values: AttendanceFormValues) => void;
  isLoading: boolean;
}

export function AttendanceCheckForm({ employees, onSubmit, isLoading }: AttendanceCheckFormProps) {
  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ipAddress: "8.8.8.8", // Default to an IP in a valid location
    },
  });

  const selectedEmployeeId = form.watch("employeeId");
  const selectedEmployee = employees.find(d => d.id === selectedEmployeeId);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employee</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an employee..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {employees.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{employee.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {selectedEmployee && (
          <div className="p-3 bg-secondary/50 rounded-md border border-secondary text-sm text-secondary-foreground flex items-center gap-2">
            <Building className="h-4 w-4" />
            Organization: <span className="font-semibold">{selectedEmployee.organization}</span>
          </div>
        )}

        <FormField
          control={form.control}
          name="ipAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IP Address</FormLabel>
              <FormControl>
                <div className="relative">
                  <Server className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="e.g., 8.8.8.8" {...field} className="pl-9"/>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
       
        <FormDescription>
            Mock locations are New York (e.g., 8.8.8.8) and San Francisco (e.g., 1.1.1.1).
        </FormDescription>

        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            "Check Attendance"
          )}
        </Button>
      </form>
    </Form>
  );
}
