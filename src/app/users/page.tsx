"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../store/store"
import { fetchAllUsers } from "../store/userSlice"
import { fetchBrandUsers } from "../store/brandsUserSlice"
import Link from "next/link"
import { Eye, Search, UserPlus, ChevronLeft, ChevronRight } from "lucide-react"
import DefaultLayoutBrand from "../../components/Layouts/DefaultLayoutBrand"

const UsersPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  // Get users from both slices
  const {
    users: allUsers,
    status: allUsersStatus,
    error: allUsersError,
  } = useSelector((state: RootState) => state.users)
  const {
    users: brandUsers,
    status: brandUsersStatus,
    error: brandUsersError,
  } = useSelector((state: RootState) => state.brandUsers)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 10

  // Search state
  const [searchTerm, setSearchTerm] = useState("")

  // User role state
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const role = localStorage.getItem("userType")
    setUserRole(role)

    // Fetch appropriate users based on role
    if (role === "admin") {
      dispatch(fetchAllUsers())
    } else {
      dispatch(fetchBrandUsers())
    }
  }, [dispatch])

  // Determine which users to display based on role
  const users = userRole === "admin" ? allUsers : brandUsers
  const status = userRole === "admin" ? allUsersStatus : brandUsersStatus
  const error = userRole === "admin" ? allUsersError : brandUsersError

  // Handle view button click based on user role
  const handleViewClick = (userId: string) => {
    if (userRole === "admin") {
      // Admin view: go to user profile
      router.push(`/profileUser?id=${userId}`)
    } else {
      // Brand view: go to user referrals
      router.push(`/users/${userId}/referrals`)
    }
  }

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Calculate pagination
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (status === "loading") {
    return userRole === "admin" ? (
      <div>Loading...</div>
    ) : (
      <DefaultLayoutBrand>
        <div>Loading...</div>
      </DefaultLayoutBrand>
    )
  }

  if (status === "failed") {
    return userRole === "admin" ? (
      <div>Error: {error}</div>
    ) : (
      <DefaultLayoutBrand>
        <div>Error: {error}</div>
      </DefaultLayoutBrand>
    )
  }

  const content = (
    <div className="p-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{userRole === "admin" ? "All Users" : "Brand Users"}</h1>
          {userRole === "admin" && (
            <Link
              href="/userForm"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <UserPlus className="w-4 h-4" />
              Add User
            </Link>
          )}
        </div>

        {/* Search input */}
        <div className="relative mt-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email"
            className="w-full rounded-md border p-2 pl-10 bg-black"
          />
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-500" />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">{userRole === "admin" ? "No users found" : "No users found for this brand"}</p>
        </div>
      ) : (
        <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-stroke dark:border-dark-3">
                <th className="px-2 pb-3.5 text-left text-sm font-medium uppercase xsm:text-base">User</th>
                <th className="px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base">Email</th>
                {userRole === "admin" && (
                  <th className="px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base">Role</th>
                )}
                {userRole !== "admin" && (
                  <th className="px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base">Username</th>
                )}
                <th className="px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, key) => (
                <tr
                  key={user._id}
                  className={key === currentUsers.length - 1 ? "" : "border-b border-stroke dark:border-dark-3"}
                >
                  <td className="flex items-center gap-3.5 px-2 py-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-bold text-lg">
                      {user.fullname ? user.fullname.charAt(0).toUpperCase() : ""}
                    </div>
                    <p className="hidden font-medium text-dark dark:text-white sm:block">{user.fullname}</p>
                  </td>
                  <td className="px-2 py-4 text-center font-medium text-dark dark:text-white">{user.email}</td>
                  {userRole === "admin" && (
                    <td className="px-2 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          user.role === "admin" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                  )}
                  {userRole !== "admin" && (
                    <td className="px-2 py-4 text-center font-medium text-dark dark:text-white">{user.username}</td>
                  )}
                  <td className="px-2 py-4 text-center">
                    <button
                      className="hover:text-primary"
                      onClick={() => handleViewClick(user._id)}
                      title={userRole === "admin" ? "View user profile" : "View user's referral links"}
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <div>
              Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
              {filteredUsers.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md bg-gray-100 text-gray-600 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span>
                {currentPage} of {Math.ceil(filteredUsers.length / usersPerPage)}
              </span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={indexOfLastUser >= filteredUsers.length}
                className="p-2 rounded-md bg-gray-100 text-gray-600 disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return userRole === "admin" ? <DefaultLayoutBrand>{content}</DefaultLayoutBrand> : <DefaultLayoutBrand>{content}</DefaultLayoutBrand>
}

export default UsersPage

