'use client'

import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function PanelNavigation() {
  return (
    // <div className="w-[50%] bg-gray-50">
      <div className="container w-full mb-3">
        <div className="grid md:grid-cols-2 gap-0">
          <Link href="/customer-panel" passHref>
            <div
              className="w-[50%] rounded-lg flex items-center justify-around text-gray-600 hover:bg-sky-700 hover:text-gray-900 text-lg font-medium p-3 cursor-pointer bg-gray-50"
            >
              <span>Customer Panel</span>
              <ExternalLink className="h-5 w-5" />
            </div>
          </Link>

          <Link target="_blank" href="/brandPanel" passHref>
            <div
              className="w-[50%] rounded-lg relative right-[14rem] flex items-center justify-around text-gray-600 hover:bg-sky-700 hover:text-gray-900 text-lg font-medium p-3 cursor-pointer bg-gray-50"
            >
              <span >Brand Panel</span>
              <ExternalLink className="h-5 w-5" />
            </div>
          </Link>
        </div>
      {/* </div> */}
     </div>
  )
}
