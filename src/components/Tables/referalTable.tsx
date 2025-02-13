"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../app/store/store"
import { fetchReferrals } from "../../app/store/referalSlice"

const ReferralTable = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { referrals, status, error } = useSelector((state: RootState) => state.referrals)

  useEffect(() => {
    dispatch(fetchReferrals())
  }, [dispatch])

  if (status === "loading") return <div>Loading...</div>
  if (status === "failed") return <div>Error: {error}</div>

  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="flex flex-col">
        <div className="grid grid-cols-4">
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">User</h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Link</h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Clicks</h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Created At</h5>
          </div>
        </div>

        {referrals.map((referral, key) => (
          <div
            className={`grid grid-cols-4 ${
              key === referrals.length - 1 ? "" : "border-b border-stroke dark:border-dark-3"
            }`}
            key={referral._id}
          >
            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">{referral.userId.fullname}</p>
            </div>

            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">
                <a href={referral.referralLink} target="_blank" rel="noopener noreferrer">
                  {referral.referralLink}
                </a>
              </p>
            </div>

            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">{referral.clicks}</p>
            </div>

            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">
                {new Date(referral.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReferralTable

