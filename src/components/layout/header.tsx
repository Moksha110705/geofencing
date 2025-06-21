import { MapPin } from "lucide-react";

export function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <MapPin className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold font-headline text-primary">
              GeoTrack Attendance
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}
