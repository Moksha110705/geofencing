"use client";

import * as React from "react";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import type { Device, Breach } from "@/types";
import { Header } from "@/components/layout/header";
import { LocationCheckForm, type LocationCheckFormValues } from "@/components/geofence/location-check-form";
import { BreachHistory } from "@/components/geofence/breach-history";
import { checkDeviceLocation } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Mock data to simulate a database
const mockDevices: Device[] = [
  { id: "dev_001", name: "Sales Laptop 1", organization: "Innovate Inc." },
  { id: "dev_002", name: "Support Phone", organization: "Innovate Inc." },
  { id: "dev_003", name: "Field Tablet", organization: "Solutions Corp" },
];

export default function Home() {
  const [breaches, setBreaches] = useState<Breach[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLocationCheck = async (data: LocationCheckFormValues) => {
    setIsLoading(true);
    const selectedDevice = mockDevices.find(d => d.id === data.deviceId);
    if (!selectedDevice) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Selected device not found.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await checkDeviceLocation(
        selectedDevice.id,
        selectedDevice.organization,
        parseFloat(data.latitude),
        parseFloat(data.longitude)
      );

      if (result.breachType !== "none") {
        const newBreach: Breach = {
          ...result,
          id: `br_${new Date().getTime()}`,
          deviceId: selectedDevice.id,
          deviceName: selectedDevice.name,
          organizationName: selectedDevice.organization,
          timestamp: new Date().toISOString(),
        };
        setBreaches(prev => [newBreach, ...prev]);
        toast({
          title: "Geofence Alert",
          description: result.alertMessage,
        });
      } else {
         toast({
          title: "Status Update",
          description: "Device is within the designated perimeter. No breach detected.",
        });
      }

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An unexpected error occurred",
        description: "Could not check device location. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background" suppressHydrationWarning>
      <Header />
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline">Simulate Location Check</CardTitle>
                <CardDescription>
                  Manually trigger a location check for a registered device.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LocationCheckForm
                  devices={mockDevices}
                  onSubmit={handleLocationCheck}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3">
            <BreachHistory breaches={breaches} />
          </div>
        </div>
      </main>
    </div>
  );
}
