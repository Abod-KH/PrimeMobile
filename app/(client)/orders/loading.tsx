import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
      <p className="ml-4 text-lg">Loading content...</p>
    </div>
  );
}