"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store/store"
import { fetchBlog, updateBlog, createBlog } from "../../app/store/blogSlice";
import Image from "next/image";
import type { Blog } from "../../app/store/blogSlice";
import BlogModal from "./modal-blog";

const BlogForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const blogId = searchParams.get("id");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    currentBlog,
    status: blogStatus,
    error: blogError,
  } = useSelector((state: RootState) => state.blogs);

  const [formData, setFormData] = useState<Partial<Blog>>({
    title: "",
    content: "",
    category: "",
  });

  const [blogImage, setBlogImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (blogId) {
      dispatch(fetchBlog(blogId));
    }
  }, [dispatch, blogId]);

  useEffect(() => {
    if (currentBlog && blogId) {
      setFormData({
        title: currentBlog.title,
        content: currentBlog.content,
        category: currentBlog.category,
      });

      if (currentBlog.image) {
        setImagePreview(currentBlog.image);
      }
    }
  }, [currentBlog, blogId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBlogImage(file);

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setBlogImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Create FormData object
    const blogFormData = new FormData();

    // Add all form fields to FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        blogFormData.append(key, value.toString());
      }
    });

    // Add image if selected
    if (blogImage) {
      blogFormData.append("blogImage", blogImage);
    }

    try {
      if (blogId) {
        await dispatch(updateBlog({ id: blogId, blogData: blogFormData })).unwrap();
        setModalMessage("Blog updated successfully");
      } else {
        await dispatch(createBlog(blogFormData)).unwrap();
        setModalMessage("Blog created successfully");
      }
      setIsModalOpen(true);
    } catch (error) {
      alert(blogId ? "Failed to update blog" : "Failed to create blog");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    router.push("/blogTable");
  };

  if (blogStatus === "loading") return <div>Loading...</div>;
  if (blogStatus === "failed") return <div>Error: {blogError}</div>;

  return (
    <div className="max-w-6xl space-y-6 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-dark">
      <h4 className="mb-6 text-3xl font-semibold text-dark dark:text-white">
        {blogId ? "Update Blog" : "Create New Blog"}
      </h4>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-lg font-medium text-dark dark:text-white"
            >
              Blog Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-lg border-2 border-gray-300 bg-dark p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-lg font-medium text-dark dark:text-white"
            >
              Blog Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-lg border-2 border-gray-300 bg-dark p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="col-span-2">
            <label
              htmlFor="blogImage"
              className="mb-2 block text-lg font-medium text-dark dark:text-white"
            >
              Blog Image
            </label>
            <div className="flex flex-col space-y-4">
              {imagePreview && (
                <div className="relative w-40 h-40">
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Blog preview"
                    fill
                    className="object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
                  >
                    ✕
                  </button>
                </div>
              )}
              <input
                type="file"
                id="blogImage"
                name="blogImage"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="w-full rounded-lg border-2 border-gray-300 bg-dark p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Upload a blog image (JPG, PNG, GIF up to 5MB)
              </p>
            </div>
          </div>

          <div className="col-span-2">
            <label
              htmlFor="content"
              className="mb-2 block text-lg font-medium text-dark dark:text-white"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="h-[485px] w-full rounded-lg border-2 border-gray-300 bg-dark p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-6 py-4 text-white transition duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:w-1/3"
          >
            {blogId ? "Update Blog" : "Create Blog"}
          </button>
        </div>
      </form>

      <BlogModal isOpen={isModalOpen} onClose={handleModalClose}>
        <h2 className="text-xl font-bold mb-4">Success!</h2>
        <p>{modalMessage}</p>
      </BlogModal>
    </div>
  );
};

export default BlogForm;
