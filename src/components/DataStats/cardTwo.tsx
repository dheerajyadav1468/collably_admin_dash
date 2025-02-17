"use client"

import { ExternalLink } from "lucide-react"
import Link from "next/link"

interface PanelNavigationProps {
  activePanel: "customer" | "brand"
  onPanelChange: (panel: "customer" | "brand") => void
}

export default function PanelNavigation({ activePanel, onPanelChange }: PanelNavigationProps) {
  return (
    <div className="container w-full mb-3">
      <div className="grid md:grid-cols-2 gap-0">
        <Link target="_blank" href="/customer-panel" passHref>
          <div
            className={`w-[50%] rounded-lg flex items-center justify-around text-lg font-medium p-3 cursor-pointer ${
              activePanel === "customer"
                ? "bg-sky-700 text-gray-900"
                : "bg-gray-50 text-gray-600 hover:bg-sky-700 hover:text-gray-900"
            }`}
            onClick={() => onPanelChange("customer")}
          >
            <span>Customer Panel</span>
            <ExternalLink className="h-5 w-5" />
          </div>
        </Link>

        <Link target="_blank" href="/brandPanel" passHref>
          <div
            className={`w-[50%] rounded-lg relative right-[14rem] flex items-center justify-around text-lg font-medium p-3 cursor-pointer ${
              activePanel === "brand"
                ? "bg-sky-700 text-gray-900"
                : "bg-gray-50 text-gray-600 hover:bg-sky-700 hover:text-gray-900"
            }`}
            onClick={() => onPanelChange("brand")}
          >
            <span>Brand Panel</span>
            <ExternalLink className="h-5 w-5" />
          </div>
        </Link>
      </div>
    </div>
  )
}

