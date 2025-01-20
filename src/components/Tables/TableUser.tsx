"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../app/store/store"
import { fetchAllUsers } from "../../app/store/userSlice"
import Link from "next/link"
import { Eye, Edit, UserPlus } from "lucide-react"

const UserTable = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { users, status, error } = useSelector((state: RootState) => state.users)
  console.log(users);

  useEffect(() => {
    dispatch(fetchAllUsers())
  }, [dispatch])

  const handleViewClick = (userId: string) => {
    router.push(`/profileUser?id=${userId}`)
  }

  const handleEditClick = (userId: string) => {
    router.push(`/userForm?id=${userId}`)
  }

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
      </div>

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
            {users.map((user, key) => (
              <tr
                key={user._id}
                className={key === users.length - 1 ? "" : "border-b border-stroke dark:border-dark-3"}
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
                  <button className="hover:text-primary ml-3" onClick={() => handleEditClick(user._id)}>
                    <Edit className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserTable

