"use client";

interface TableProps {
    children: React.ReactNode;
  }
  
  export function Table({ children }: TableProps) {
    return (
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">{children}</table>
      </div>
    )
  }
  
  export function TableHeader({ children }: TableProps) {
    return <thead>{children}</thead>
  }
  
  export function TableBody({ children }: TableProps) {
    return <tbody>{children}</tbody>
  }
  
  export function TableRow({ children }: TableProps) {
    return <tr className="border-b transition-colors hover:bg-gray-50">{children}</tr>
  }
  
  export function TableHead({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
      <th className={`h-12 px-4 text-left align-middle font-medium ${className}`}>
        {children}
      </th>
    )
  }
  
  export function TableCell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
      <td className={`p-4 align-middle ${className}`}>
        {children}
      </td>
    )
  }
  
  