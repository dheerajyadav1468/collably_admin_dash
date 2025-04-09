"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../app/store/store"
import { fetchAllBlogs, deleteBlog } from "../../app/store/blogSlice"
import Link from "next/link"
import { Filter, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react"

const BlogTable = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { blogs, status, error } = useSelector((state: RootState) => state.blogs)

  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: "",
    searchTerm: "",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const blogsPerPage = 10

  useEffect(() => {
    dispatch(fetchAllBlogs())
  }, [dispatch])

  const handleViewClick = (blogId: string) => {
    router.push(`/profileBlog?id=${blogId}`)
  }

  const handleEditClick = (blogId: string) => {
    router.push(`/createBlog?id=${blogId}`)
  }

  const handleDeleteClick = async (blogId: string) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await dispatch(deleteBlog(blogId)).unwrap()
        alert("Blog deleted successfully")
      } catch (error) {
        alert("Failed to delete blog")
      }
    }
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const filteredBlogs = blogs.filter((blog) => {
    return (
      (!filters.category || blog.category.toLowerCase().includes(filters.category.toLowerCase())) &&
      (!filters.searchTerm ||
        blog.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(filters.searchTerm.toLowerCase()))
    )
  })

  // Pagination
  const indexOfLastBlog = currentPage * blogsPerPage
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (status === "loading") return <div>Loading...</div>
  if (status === "failed") return <div>Error: {error}</div>

  return (
    <div className="p-4 bg-dark text-gray rounded-lg w-full">
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">All Blogs</h1>
          <div className="flex gap-2">
            <Link
              href="/blog-form"
              className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add Blog
            </Link>
            <button
              onClick={toggleFilters}
              className={`flex items-center gap-2 rounded px-4 py-2 hover:bg-gray-200 ${
                showFilters ? "bg-gray-200" : "bg-gray-100"
              } text-gray-700`}
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full rounded-md border p-2 bg-black text-gray"
            >
              <option value="">All Categories</option>
              {/* Extract unique categories from blogs */}
              {/* {[...new Set(blogs.map((blog) => blog.category))].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))} */}
            </select>
          </div>
        )}

        <div className="relative mt-4">
          <input
            type="text"
            name="searchTerm"
            value={filters.searchTerm}
            onChange={handleFilterChange}
            placeholder="Search blogs by title or content"
            className="w-full rounded-md border bg-black p-2 pl-10"
          />
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-500" />
        </div>
      </div>

      {filteredBlogs.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No blogs found</p>
        </div>
      ) : (
        <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-stroke dark:border-dark-3">
                <th className="px-2 pb-3.5 text-left text-sm font-medium uppercase xsm:text-base">Title</th>
                <th className="px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base">Category</th>
                <th className="px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base">Author</th>
                <th className="px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base">Date</th>
                <th className="hidden px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base sm:table-cell">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentBlogs.map((blog, key) => (
                <tr
                  key={blog._id}
                  className={key === currentBlogs.length - 1 ? "" : "border-b border-stroke dark:border-dark-3"}
                >
                  <td className="flex items-center gap-3.5 px-2 py-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                      {blog.title ? blog.title.charAt(0).toUpperCase() : ""}
                    </div>
                    <p className="hidden font-medium text-dark dark:text-white sm:block">
                      {blog.title.length > 30 ? `${blog.title.substring(0, 30)}...` : blog.title}
                    </p>
                  </td>
                  <td className="px-2 py-4 text-center font-medium text-dark dark:text-white">{blog.category}</td>
                  <td className="px-2 py-4 text-center font-medium text-dark dark:text-white">
                    {blog.author ? (typeof blog.author === "string" ? blog.author : "User") : "Unknown"}
                  </td>
                  <td className="px-2 py-4 text-center font-medium text-dark dark:text-white">
                    {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-2 py-4 text-center sm:table-cell">
                    <button className="hover:text-primary" onClick={() => handleViewClick(blog._id)}>
                      <svg
                        className="fill-current"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.99935 6.87492C8.27346 6.87492 6.87435 8.27403 6.87435 9.99992C6.87435 11.7258 8.27346 13.1249 9.99935 13.1249C11.7252 13.1249 13.1243 11.7258 13.1243 9.99992C13.1243 8.27403 11.7252 6.87492 9.99935 6.87492ZM8.12435 9.99992C8.12435 8.96438 8.96382 8.12492 9.99935 8.12492C11.0349 8.12492 11.8743 8.96438 11.8743 9.99992C11.8743 11.0355 11.0349 11.8749 9.99935 11.8749C8.96382 11.8749 8.12435 11.0355 8.12435 9.99992Z"
                          fill=""
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.99935 2.70825C6.23757 2.70825 3.70376 4.96175 2.23315 6.8723L2.20663 6.90675C1.87405 7.3387 1.56773 7.73652 1.35992 8.20692C1.13739 8.71064 1.04102 9.25966 1.04102 9.99992C1.04102 10.7402 1.13739 11.2892 1.35992 11.7929C1.56773 12.2633 1.87405 12.6611 2.20664 13.0931L2.23316 13.1275C3.70376 15.0381 6.23757 17.2916 9.99935 17.2916C13.7611 17.2916 16.2949 15.0381 17.7655 13.1275L17.792 13.0931C18.1246 12.6612 18.431 12.2633 18.6388 11.7929C18.8613 11.2892 18.9577 10.7402 18.9577 9.99992C18.9577 9.25966 18.8613 8.71064 18.6388 8.20692C18.431 7.73651 18.1246 7.33868 17.792 6.90673L17.7655 6.8723C16.2949 4.96175 13.7611 2.70825 9.99935 2.70825Z"
                          fill=""
                        />
                      </svg>
                    </button>
                    <button className="hover:text-primary ml-2" onClick={() => handleEditClick(blog._id)}>
                      <svg
                        className="fill-current"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.31 1.3l-2.7 2.7L16.6 7.31 14.31 12.7 12 10.41 14.31 8.12 16.6 10.41 14.31 12.7 12 14.99 9.69 12.7 8.38 10.41 10.69 8.12 12 5.83 9.69 4.52 12 2.23 14.31 4.52 16.6 2.23 14.31 1.3z"
                          fill=""
                        />
                      </svg>
                    </button>
                    <button className="hover:text-red-500 ml-2" onClick={() => handleDeleteClick(blog._id)}>
                      <svg
                        className="fill-current"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm.707-10.707l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 1.414-1.414l3 3 3-3a1 1 0 0 1 1.414 1.414z"
                          fill=""
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <div>
              Showing {indexOfFirstBlog + 1} to {Math.min(indexOfLastBlog, filteredBlogs.length)} of{" "}
              {filteredBlogs.length} entries
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
                {currentPage} of {Math.ceil(filteredBlogs.length / blogsPerPage)}
              </span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={indexOfLastBlog >= filteredBlogs.length}
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

export default BlogTable
