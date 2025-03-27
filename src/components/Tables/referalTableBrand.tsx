"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../app/store/store"
import { fetchBrandReferrals } from "../../app/store/brandReferalSlice"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

interface BrandReferral {
  _id: string
  userId: {
    _id: string
    fullname: string
    username: string
  }
  referralLink: string
  clicks: number
  createdAt: string
}

export default function BrandReferralTable() {
  const dispatch = useDispatch<AppDispatch>()
  const { referrals, status, error } = useSelector((state: RootState) => state.brandReferrals)

  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const referralsPerPage = 10

  useEffect(() => {
    dispatch(fetchBrandReferrals())
  }, [dispatch])

  const filteredReferrals = (referrals || []).filter((referral: BrandReferral) => {
    return (
      !searchTerm ||
      (referral.userId?.username && referral.userId.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (referral.userId?.fullname && referral.userId.fullname.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })

  const indexOfLastReferral = currentPage * referralsPerPage
  const indexOfFirstReferral = indexOfLastReferral - referralsPerPage
  const currentReferrals = filteredReferrals.slice(indexOfFirstReferral, indexOfLastReferral)
console.log(referrals)
  if (status === "loading") return <div>Loading...</div>
  if (status === "failed") return <div>Error: {error}</div>

  return (
    <div className="w-full rounded-lg bg-dark p-4 text-gray">
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Brand Referrals</h1>
        </div>

        <div className="relative mt-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by username or full name"
            className="w-full rounded-md border bg-black p-2 pl-10"
          />
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-500" />
        </div>
      </div>

      <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
        {referrals.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No referrals found for this brand</div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-stroke dark:border-dark-3">
                <th className="px-2 pb-3.5 text-left text-sm font-medium uppercase xsm:text-base">User</th>
                <th className="px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base">Link</th>
                <th className="px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base">Clicks</th>
                <th className="px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base">Created At</th>
              </tr>
            </thead>
            <tbody>
            {currentReferrals.map((referral: BrandReferral, key) => { return (
    <tr
      key={referral._id}
      className={key === currentReferrals.length - 1 ? "" : "border-b border-stroke dark:border-dark-3"}
    >
      <td className="px-2 py-4 text-left font-medium text-dark dark:text-white">
        {referral.userId?.fullname || "N/A"}
      </td>
      <td className="px-2 py-4 text-center font-medium text-dark dark:text-white">
        <a href={referral.referralLink} target="_blank" rel="noopener noreferrer">
          {referral.referralLink}
        </a>
      </td>
      <td className="px-2 py-4 text-center font-medium text-dark dark:text-white">{referral.clicks}</td>
      <td className="px-2 py-4 text-center font-medium text-dark dark:text-white">
        {new Date(referral.createdAt).toLocaleDateString()}
      </td>
    </tr>
  );
})}

            </tbody>
          </table>
        )}

        {/* Pagination - only show if we have referrals */}
        {filteredReferrals.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <div>
              Showing {indexOfFirstReferral + 1} to {Math.min(indexOfLastReferral, filteredReferrals.length)} of{" "}
              {filteredReferrals.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-md bg-gray-100 p-2 text-gray-600 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span>
                {currentPage} of {Math.ceil(filteredReferrals.length / referralsPerPage)}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={indexOfLastReferral >= filteredReferrals.length}
                className="rounded-md bg-gray-100 p-2 text-gray-600 disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

