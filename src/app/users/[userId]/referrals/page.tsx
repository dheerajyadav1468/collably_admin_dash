"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../../store/store"
import { fetchUserBrandReferrals } from "../../../store/userBrandSlice"
import { Search, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"
import DefaultLayoutBrand from "../../../../components/Layouts/DefaultLayoutBrand";

export default function UserBrandReferralTable() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { referrals, status, error } = useSelector((state: RootState) => state.userBrandReferrals)
  const { users } = useSelector((state: RootState) => state.brandUsers)

  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const referralsPerPage = 10

  const userId = params.userId as string

  useEffect(() => {
    console.log("Component mounted with userId:", userId)
    if (userId) {
      dispatch(fetchUserBrandReferrals(userId))
    }
  }, [dispatch, userId])

  // Find the user's name from the brandUsers state
  const user = users.find((user) => user._id === userId)
  const userName = user ? user.fullname : "User"

  const filteredReferrals = (referrals || []).filter((referral) => {
    return !searchTerm || referral.referralLink.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const indexOfLastReferral = currentPage * referralsPerPage
  const indexOfFirstReferral = indexOfLastReferral - referralsPerPage
  const currentReferrals = filteredReferrals.slice(indexOfFirstReferral, indexOfLastReferral)

  const handleBackClick = () => {
    router.push("/brandPanel/users")
  }

  if (status === "loading") return <DefaultLayoutBrand><div>Loading...</div></DefaultLayoutBrand>
  if (status === "failed") return <DefaultLayoutBrand><div>Error: {error}</div></DefaultLayoutBrand>

  return (
    <DefaultLayoutBrand>
    <div className="w-full rounded-lg bg-dark p-4 text-gray">
      <div className="mb-6">
        <div className="mb-4 flex items-center">
          <button onClick={handleBackClick} className="mr-4 p-2 rounded-full hover:bg-gray-200" title="Back to users">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold">{userName}&apos;s Referral Links</h1>
        </div>

        <div className="relative mt-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by referral link"
            className="w-full rounded-md border bg-black p-2 pl-10"
          />
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-500" />
        </div>
      </div>

      <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
        {filteredReferrals.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No referral links found for this user</div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-stroke dark:border-dark-3">
                <th className="px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base">Link</th>
                <th className="px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base">Clicks</th>
                <th className="px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base">Created At</th>
              </tr>
            </thead>
            <tbody>
              {currentReferrals.map((referral, key) => (
                <tr
                  key={referral._id}
                  className={key === currentReferrals.length - 1 ? "" : "border-b border-stroke dark:border-dark-3"}
                >
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
              ))}
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
    </DefaultLayoutBrand>
  )
}

