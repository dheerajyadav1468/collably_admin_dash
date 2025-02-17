'use client'

import { Card, CardContent } from './card'
import { Coins, DollarSign, ShoppingCart, RefreshCcw, Package, Store, Users, Ticket, Upload, TypeIcon as type, LucideIcon } from 'lucide-react'

interface MetricCardProps {
  icon: LucideIcon
  value: string | number
  label: string
  sublabel?: string
}

function MetricCard({ icon: Icon, value, label, sublabel }: MetricCardProps) {
  return (
    <Card className=" dark:bg-gray-dark">
      <CardContent className="pt-6">
        <div className="flex flex-row gap-10 items-center">
          <Icon className="h-8 w-8 text-blue-400" />
          <div className="flex flex-col gap-1">
            <span className="text-3xl font-semibold text-white">
              {value}
            </span>
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm font-medium ">
                {label}
              </span>
              {sublabel && (
                <span className="text-gray-400 text-xs">
                  {sublabel}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const metrics = [
    {
      icon: Coins,
      value: '₹0',
      label: 'TOTAL SALES (LAST 30 DAYS)',
    },
    {
      icon: DollarSign,
      value: '₹0',
      label: 'COMMISSION (LAST 30 DAYS)',
    },
    {
      icon: ShoppingCart,
      value: '0',
      label: 'ORDERS (LAST 30 DAYS)',
    },
    {
      icon: RefreshCcw,
      value: '0',
      label: 'REFUND REQUESTS',
    },
    {
      icon: Package,
      value: '1',
      label: 'PRODUCTS (LAST 30 DAYS)',
    },
    {
      icon: Store,
      value: '0',
      label: 'BRANDS (LAST 30 DAYS)',
    },
    {
      icon: Users,
      value: '0',
      label: 'USERS (LAST 30 DAY)',
    },
    {
      icon: Ticket,
      value: '3',
      label: 'OPEN TICKETS',
    },
    {
      icon: Upload,
      value: '1',
      label: 'WITHDRAWAL REQUEST (PENDING)',
    }
  ]

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            icon={metric.icon}
            value={metric.value}
            label={metric.label}
          />
        ))}
      </div>
    </div>
  )
}

