import React from 'react';

// Card Component
export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-lg shadow-lg overflow-hidden w-full h-full min-h-[10px] ${className}`}>
      {children}
    </div>
  );
}

// CardContent Component
export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
}
