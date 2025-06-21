'use server';

/**
 * @fileOverview Determines whether a device's movement constitutes entering or exiting the designated area.
 *
 * - determineEntryExit - A function that handles the entry/exit determination process.
 * - DetermineEntryExitInput - The input type for the determineEntryExit function.
 * - DetermineEntryExitOutput - The return type for the determineEntryExit function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DeviceLocationSchema = z.object({
  latitude: z.number().describe('The latitude of the device.'),
  longitude: z.number().describe('The longitude of the device.'),
  timestamp: z.string().datetime().describe('The timestamp of the location reading (ISO 8601 format).'),
});

const PerimeterSchema = z.array(
  z.object({
    latitude: z.number().describe('Latitude of the perimeter point.'),
    longitude: z.number().describe('Longitude of the perimeter point.'),
  })
).describe('The allowed perimeter defined by a set of latitudinal and longitudinal coordinates.');

const DetermineEntryExitInputSchema = z.object({
  deviceId: z.string().describe('The unique identifier of the device.'),
  currentLocation: DeviceLocationSchema.describe('The current location of the device.'),
  previousLocations: z.array(DeviceLocationSchema).describe('The history of device locations.'),
  allowedPerimeter: PerimeterSchema,
  organizationName: z.string().describe('The name of the organization associated with the device.'),
});
export type DetermineEntryExitInput = z.infer<typeof DetermineEntryExitInputSchema>;

const DetermineEntryExitOutputSchema = z.object({
  breachType: z.enum(['entry', 'exit', 'none']).describe('The type of breach detected: entry, exit, or none.'),
  alertMessage: z.string().describe('A message describing the breach, if any.'),
});
export type DetermineEntryExitOutput = z.infer<typeof DetermineEntryExitOutputSchema>;

export async function determineEntryExit(input: DetermineEntryExitInput): Promise<DetermineEntryExitOutput> {
  return determineEntryExitFlow(input);
}

const determineEntryExitPrompt = ai.definePrompt({
  name: 'determineEntryExitPrompt',
  input: {schema: DetermineEntryExitInputSchema},
  output: {schema: DetermineEntryExitOutputSchema},
  prompt: `You are an AI assistant specializing in geofencing and location analysis.

You are provided with the current location of a device, its recent location history, the allowed perimeter, and the organization it belongs to. Your task is to determine if the device has entered or exited the allowed perimeter.

Device ID: {{{deviceId}}}
Organization: {{{organizationName}}}
Current Location: Latitude: {{{currentLocation.latitude}}}, Longitude: {{{currentLocation.longitude}}}, Timestamp: {{{currentLocation.timestamp}}}
Previous Locations:
{{#each previousLocations}}
  Latitude: {{{latitude}}}, Longitude: {{{longitude}}}, Timestamp: {{{timestamp}}}
{{/each}}

Allowed Perimeter:
{{#each allowedPerimeter}}
  Latitude: {{{latitude}}}, Longitude: {{{longitude}}}
{{/each}}

Based on this information, determine if the device has entered, exited, or remained within the allowed perimeter. Return 'entry', 'exit', or 'none' for breachType. If there is a breach, provide a descriptive alertMessage explaining the situation.
`,
});

const determineEntryExitFlow = ai.defineFlow(
  {
    name: 'determineEntryExitFlow',
    inputSchema: DetermineEntryExitInputSchema,
    outputSchema: DetermineEntryExitOutputSchema,
  },
  async input => {
    const {output} = await determineEntryExitPrompt(input);
    return output!;
  }
);
