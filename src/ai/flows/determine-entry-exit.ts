'use server';

/**
 * @fileOverview Determines whether a device's movement constitutes exiting the designated area.
 *
 * - determineEntryExit - A function that handles the exit determination process.
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
  allowedPerimeter: PerimeterSchema,
  organizationName: z.string().describe('The name of the organization associated with the device.'),
});
export type DetermineEntryExitInput = z.infer<typeof DetermineEntryExitInputSchema>;

const DetermineEntryExitOutputSchema = z.object({
  breachType: z.enum(['exit', 'none']).describe("The type of breach detected: 'exit' if outside the perimeter, or 'none' if inside."),
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
  prompt: `You are an AI assistant specializing in geofencing analysis. Your task is to determine if a device's current location is inside or outside a specified geographical perimeter.

You will be given the device's current location and the coordinates that define the allowed perimeter.

- If the device is inside the perimeter, the breach type is 'none'.
- If the device is outside the perimeter, it's a breach. Classify any breach as an 'exit'.

Device ID: {{{deviceId}}}
Organization: {{{organizationName}}}
Current Location: Latitude: {{{currentLocation.latitude}}}, Longitude: {{{currentLocation.longitude}}}

Allowed Perimeter (a series of points defining a polygon):
{{#each allowedPerimeter}}
  - Latitude: {{{latitude}}}, Longitude: {{{longitude}}}
{{/each}}

Based on this information, determine the breachType ('exit' or 'none') and provide a concise alertMessage. For an 'exit', the message should state that the device is outside the allowed area. For 'none', it should state the device is within the area.
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
