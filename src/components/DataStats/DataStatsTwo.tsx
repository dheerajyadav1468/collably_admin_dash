"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "./card"
import {
  Coins,
  DollarSign,
  ShoppingCart,
  RefreshCcw,
  Package,
  Store,
  Users,
  Ticket,
  Upload,
  type LucideIcon,
} from "lucide-react"
import { fetchBrandReferrals, fetchAllBrandReferrals } from "../../app/store/brandReferalSlice"
import { fetchBrandUsers } from "../../app/store/brandsUserSlice"
import { fetchAllUsers } from "../../app/store/userSlice"
import type { AppDispatch, RootState } from "../../app/store/store"

interface MetricCardProps {
  icon: LucideIcon
  value: string | number
  label: string
  sublabel?: string
  isLoading?: boolean
  onClick?: () => void
}

function MetricCard({ icon: Icon, value, label, sublabel, isLoading = false, onClick }: MetricCardProps) {
  return (
    <div 
      className="cursor-pointer transition-all hover:scale-105" 
      onClick={onClick}
    >
      <Card className="dark:bg-gray-dark">
        <CardContent className="pt-6">
          <div className="flex flex-row gap-10 items-center">
            <Icon className="h-8 w-8 text-blue-400" />
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-semibold text-white">{isLoading ? "..." : value}</span>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm font-medium">{label}</span>
                {sublabel && <span className="text-gray-400 text-xs">{sublabel}</span>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter() 


  const [userRole, setUserRole] = useState<string | null>(null)

  const { referrals, status: referralsStatus } = useSelector((state: RootState) => state.brandReferrals)
  const { users, status: usersStatus } = useSelector((state: RootState) => state.brandUsers)
  const { users: allUsers, status: allUsersStatus } = useSelector((state: RootState) => state.users)

  useEffect(() => {
    const role = localStorage.getItem("userType")
    setUserRole(role)

    if (role === "admin") {
      dispatch(fetchAllBrandReferrals())
      dispatch(fetchAllUsers())
    } else {
      dispatch(fetchBrandReferrals())
      dispatch(fetchBrandUsers())
    }
  }, [dispatch])

  const isReferralsLoading = referralsStatus === "loading" || referralsStatus === "idle"
  const isUsersLoading = usersStatus === "loading" || usersStatus === "idle"

  const referralCount = referrals?.length || 0
  const creatorCount = userRole === "admin" ? allUsers?.length || 0 : users?.length || 0
  const isAllUsersLoading = allUsersStatus === "loading" || allUsersStatus === "idle"

  const metrics = [
    {
      icon: Coins,
      value: "₹0",
      label: "TOTAL SALES (LAST 30 DAYS)",
    },
    {
      icon: DollarSign,
      value: "₹0",
      label: "COMMISSION (LAST 30 DAYS)",
    },
    {
      icon: ShoppingCart,
      value: "0",
      label: "ORDERS (LAST 30 DAYS)",
    },
    {
      icon: RefreshCcw,
      value: referralCount,
      label: "REFERRAL LINKS",
      isLoading: isReferralsLoading,
      onClick: () => router.push("/affiliateBrand"), 
    },
    {
      icon: Users,
      value: creatorCount,
      label: "CREATORS",
      isLoading: userRole === "admin" ? isAllUsersLoading : isUsersLoading,
      onClick: () => router.push("/users"),
    },
    {
      icon: Package,
      value: "0",
      label: "PRODUCTS (LAST 30 DAYS)",
    },
    {
      icon: Users,
      value: "0",
      label: "USERS (LAST 30 DAY)",
    },
    {
      icon: Ticket,
      value: "3",
      label: "OPEN TICKETS",
    },
    {
      icon: Upload,
      value: "1",
      label: "WITHDRAWAL REQUEST (PENDING)",
    },
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
            isLoading={metric.isLoading}
            onClick={metric.onClick} 
          />
        ))}
      </div>
    </div>
  )
}
