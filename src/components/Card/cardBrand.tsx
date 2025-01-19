"use client";

interface CardProps {
    children: React.ReactNode;
    className?: string;
  }
  
  export function Card({ children, className = "" }: CardProps) {
    return (
      <div className={`bg-white rounded-lg shadow-md ${className}`}>
        {children}
      </div>
    )
  }
  
  export function CardHeader({ children }: { children: React.ReactNode }) {
    return <div className="p-4 border-b">{children}</div>
  }
  
  export function CardTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="text-xl font-bold">{children}</h2>
  }
  
  export function CardContent({ children }: { children: React.ReactNode }) {
    return <div className="p-4">{children}</div>
  }
  
  