"use client";

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface ClientTimeProps {
  timestamp: string;
}

export function ClientTime({ timestamp }: ClientTimeProps) {
  const [timeAgo, setTimeAgo] = useState<string | null>(null);

  useEffect(() => {
    setTimeAgo(formatDistanceToNow(new Date(timestamp), { addSuffix: true }));
  }, [timestamp]);

  return <>{timeAgo}</>;
}
