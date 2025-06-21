"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Building, Loader2, Smartphone } from "lucide-react";

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
import type { Device } from "@/types";

const formSchema = z.object({
  deviceId: z.string({ required_error: "Please select a device." }),
  latitude: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= -90 && parseFloat(val) <= 90, {
    message: "Enter a valid latitude (-90 to 90).",
  }),
  longitude: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= -180 && parseFloat(val) <= 180, {
    message: "Enter a valid longitude (-180 to 180).",
  }),
});

export type LocationCheckFormValues = z.infer<typeof formSchema>;

interface LocationCheckFormProps {
  devices: Device[];
  onSubmit: (values: LocationCheckFormValues) => void;
  isLoading: boolean;
}

export function LocationCheckForm({ devices, onSubmit, isLoading }: LocationCheckFormProps) {
  const [selectedDevice, setSelectedDevice] = useState<Device | undefined>(undefined);

  const form = useForm<LocationCheckFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      latitude: "34.06", // Default to a location near the geofence
      longitude: "-118.25",
    },
  });

  const selectedDeviceId = form.watch("deviceId");

  useEffect(() => {
    setSelectedDevice(devices.find(d => d.id === selectedDeviceId));
  }, [selectedDeviceId, devices]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="deviceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Device</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a device to check..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {devices.map(device => (
                    <SelectItem key={device.id} value={device.id}>
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        <span>{device.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {selectedDevice && (
          <div className="p-3 bg-secondary/50 rounded-md border border-secondary text-sm text-secondary-foreground flex items-center gap-2">
            <Building className="h-4 w-4" />
            Organization: <span className="font-semibold">{selectedDevice.organization}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Latitude</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 34.0522" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Longitude</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., -118.2437" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormDescription>
            The mock geofence is around Downtown Los Angeles (approx. 34.05, -118.24).
        </FormDescription>

        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            "Check Location"
          )}
        </Button>
      </form>
    </Form>
  );
}
