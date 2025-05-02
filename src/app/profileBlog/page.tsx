"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../app/store/store"
import { fetchBlog } from "../../app/store/blogSlice"
import Link from "next/link"
import Image from "next/image"
import DefaultLayout from "../../components/Layouts/DefaultLaout";

const BlogProfile = () => {
  const dispatch = useDispatch<AppDispatch>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const blogId = searchParams.get("id")
  const { currentBlog, status, error } = useSelector((state: RootState) => state.blogs)

  useEffect(() => {
    if (blogId) {
      dispatch(fetchBlog(blogId))
    }
  }, [dispatch, blogId])

  const handleEditClick = () => {
    if (blogId) {
      router.push(`/createBlog?id=${blogId}`)
    }
  }

  if (status === "loading") return <div>Loading...</div>
  if (status === "failed") return <div>Error: {error}</div>
  if (!currentBlog) return <div>No blog found</div>

  return (
    <DefaultLayout>
      <div className="p-6 max-w-6xl bg-white dark:bg-gray-dark rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-dark dark:text-white">{currentBlog.title}</h2>
          <button
            onClick={handleEditClick}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Edit Blog
          </button>
        </div>

        {currentBlog.image && (
          <div className="mb-6">
            <div className="relative w-full h-64 md:h-96">
              <Image
                src={currentBlog.image || "/placeholder.svg"}
                alt={currentBlog.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        )}

        <div className="mb-4">
          <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
            {currentBlog.category}
          </span>
          {currentBlog.createdAt && (
            <span className="text-sm text-gray-500">
              Posted on {new Date(currentBlog.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <div dangerouslySetInnerHTML={{ __html: currentBlog.content.replace(/\n/g, "<br />") }} />
        </div>

        <div className="mt-8 pt-4 border-t border-gray-200">
          <Link href="/blogTable" className="text-blue-500 hover:text-blue-700">
            ← Back to all blogs
          </Link>
        </div>
      </div>
    </DefaultLayout>
  )
}

export default BlogProfile
