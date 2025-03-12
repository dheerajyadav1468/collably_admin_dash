"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../app/store/store"
import { fetchAllUsers } from "../../app/store/userSlice"
import Link from "next/link"
import { Eye, Search, UserPlus, ChevronLeft, ChevronRight } from "lucide-react"

const UserTable = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { users, status, error } = useSelector((state: RootState) => state.users)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 10

  // Search state
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    dispatch(fetchAllUsers())
  }, [dispatch])

  useEffect(() => {
    console.log("Users state:", users)
    console.log("Status:", status)
    console.log("Error:", error)
  }, [users, status, error])

  const handleViewClick = (userId: string) => {
    router.push(`/profileUser?id=${userId}`)
  }

  const handleEditClick = (userId: string) => {
    router.push(`/userForm?id=${userId}`)
  }

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate pagination
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (status === "loading") return <div>Loading...</div>
  if (status === "failed") return <div>Error: {error}</div>

  return (
    <div className="p-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Users</h1>
          <Link
            href="/userForm"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </Link>
        </div>

        {/* Search input */}
        <div className="relative mt-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email"
            className="w-full rounded-md border p-2 pl-10"
          />
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-500" />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No users found</p>
        </div>
      ) : (
        <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-stroke dark:border-dark-3">
                <th className="px-2 pb-3.5 text-left text-sm font-medium uppercase xsm:text-base">User</th>
                <th className="px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base">Email</th>
                <th className="px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base">Role</th>
                <th className="hidden px-2 pb-3.5 text-center text-sm font-medium uppercase sm:table-cell xsm:text-base">
                  Action
                </th>
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
                  <td className="px-2 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        user.role === "admin" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-2 py-4 text-center sm:table-cell">
                    <button className="hover:text-primary" onClick={() => handleViewClick(user._id)}>
                      <Eye className="w-5 h-5" />
                    </button>
                    {/* <button className="hover:text-primary ml-3" onClick={() => handleEditClick(user._id)}>
                      <Edit className="w-5 h-5" />
                    </button> */}
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
}

export default UserTable

