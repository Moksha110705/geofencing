<a href="https://studio.firebase.google.com/import?url=https%3A%2F%2Fgithub.com%2FMoksha110705%2Fgeofencing">
  <picture>
    <source
      media="(prefers-color-scheme: dark)"
      srcset="https://cdn.firebasestudio.dev/btn/open_dark_32.svg">
    <source
      media="(prefers-color-scheme: light)"
      srcset="https://cdn.firebasestudio.dev/btn/open_light_32.svg">
    <img
      height="32"
      alt="Open in Firebase Studio"
      src="https://cdn.firebasestudio.dev/btn/open_blue_32.svg">
  </picture>
</a>



<a href="https://studio.firebase.google.com/import?url=https%3A%2F%2Fgithub.com%2FMoksha110705%2Fgeofencing">
  <picture>
    <source
      media="(prefers-color-scheme: dark)"
      srcset="https://cdn.firebasestudio.dev/btn/continue_dark_32.svg">
    <source
      media="(prefers-color-scheme: light)"
      srcset="https://cdn.firebasestudio.dev/btn/continue_light_32.svg">
    <img
      height="32"
      alt="Continue in Firebase Studio"
      src="https://cdn.firebasestudio.dev/btn/continue_blue_32.svg">
  </picture>
</a>
# IP-Based Attendance System

This is a Next.js application built in Firebase Studio that demonstrates a simple, IP-based attendance tracking system. It allows for the simulation of employees checking their attendance, where their location is verified based on their IP address against their organization's required location.

## Features

- **Simulate Attendance Checks**: A simple form to select an employee and enter an IP address to check their attendance status.
- **IP-Based Location Verification**: A server-side action that cross-references an IP address with a mock database of known locations.
- **Mock Data**: The application uses mock data to represent employees, their assigned organizations, and the physical locations associated with specific IP addresses.
- **Real-time History**: A log that displays the history of all attendance checks, showing whether an employee was marked "Present" or "Absent".
- **Modern UI**: The user interface is built with the sleek and accessible [ShadCN UI](https://ui.shadcn.com/) component library.
- **Server-Side Logic**: Core functionality is handled securely on the server using Next.js Server Actions.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Integration**: [Google AI & Genkit](https://firebase.google.com/docs/genkit) (Note: The core attendance logic was refactored to use direct computation, but Genkit remains part of the project structure).

## How It Works

The application is structured as a single-page interface with two main parts: an attendance check form and a history log.

1.  **Frontend (`src/app/page.tsx`)**: This is the main entry point of the application. It's a Client Component that manages the state for the attendance form and the list of attendance records.
2.  **Attendance Form (`src/components/geofence/location-check-form.tsx`)**: This component provides the UI for selecting an employee and inputting an IP address. On submission, it calls a Server Action.
3.  **Server Action (`src/app/actions.ts`)**: The `checkAttendance` function handles the core logic. It contains mock data for:
    -   Organizations and their required locations (e.g., "Innovate Inc." requires a "New York" location).
    -   IP addresses and their corresponding locations (e.g., IP `8.8.8.8` maps to "New York").
4.  **Attendance Logic**: When the action is called, it looks up the required location for the employee's organization and compares it to the location mapped to the provided IP address. It returns a "present" status if they match and "absent" otherwise.
5.  **History Display (`src/components/geofence/breach-history.tsx`)**: This component receives the list of attendance records and displays them in a formatted table, providing a real-time log of all checks.

## Getting Started

The application is designed to run within the Firebase Studio environment.

- **Dependencies**: All required npm packages are listed in `package.json` and are automatically installed.
- **Running the App**: Use the `npm run dev` script to start the development server.
- **Environment Variables**: The project includes a `.env` file for API keys. To use any Google AI-powered features, you'll need to add your API key there: `GOOGLE_API_KEY="YOUR_API_KEY_HERE"`.
