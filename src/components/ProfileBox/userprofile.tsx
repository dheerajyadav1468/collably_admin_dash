"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../app/store/store"
import { fetchUser } from "../../app/store/userSlice"
import Link from "next/link"

const ProfileUser = () => {
  const dispatch = useDispatch<AppDispatch>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const userId = searchParams.get("id")
  const { currentUser, status, error } = useSelector((state: RootState) => state.users)

  useEffect(() => {
    if (userId) {
      dispatch(fetchUser(userId))
    }
  }, [dispatch, userId])

  const handleEditClick = () => {
    if (userId) {
      router.push(`/userForm?id=${userId}`)
    }
  }

  if (status === "loading") return <div>Loading...</div>
  if (status === "failed") return <div>Error: {error}</div>
  if (!currentUser) return <div>No user found</div>

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">{currentUser.fullname}&apos;s Profile</h2>

        <button
          onClick={handleEditClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Edit Profile
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <img
            src={currentUser.avatar || "/placeholder.svg"}
            alt={currentUser.fullname}
            className="w-32 h-32 rounded-full mx-auto"
          />
          <h3 className="text-xl font-semibold text-center mt-4">{currentUser.username}</h3>
          <p className="text-gray-600 text-center">{currentUser.email}</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-2">User Information</h4>
          <p>
            <strong>Full Name:</strong> {currentUser.fullname}
          </p>
          <p>
            <strong>Gender:</strong> {currentUser.gender}
          </p>
          <p>
            <strong>Mobile:</strong> {currentUser.mobile || "Not provided"}
          </p>
          <p>
            <strong>Address:</strong> {currentUser.address || "Not provided"}
          </p>
          <p>
            <strong>Website:</strong>{" "}
            {currentUser.website ? (
              <a
                href={currentUser.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {currentUser.website}
              </a>
            ) : (
              "Not provided"
            )}
          </p>
        </div>
      </div>
      <div className="mt-6">
        <h4 className="text-lg font-semibold mb-2">Story</h4>
        <p>{currentUser.story || "No story provided"}</p>
      </div>
      <div className="mt-6">
        <h4 className="text-lg font-semibold mb-2">Social</h4>
        <p>
          <strong>Followers:</strong> {currentUser.followers.length}
        </p>
        <p>
          <strong>Following:</strong> {currentUser.following.length}
        </p>
      </div>
    </div>
  )
}

export default ProfileUser

