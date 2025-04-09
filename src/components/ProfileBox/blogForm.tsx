"use client";

import { useState } from "react";

const BlogForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <div className="max-w-6xl space-y-6 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-dark">
      <h4 className="mb-6 text-3xl font-semibold text-dark dark:text-white">
        Create New Blog
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

          {/* Image Button */}
          <div>
            <label
              htmlFor="media"
              className="mb-2 block text-lg font-medium text-dark dark:text-white"
            >
              Add Image
            </label>
            <input
              type="file"
              id="media"
              name="media"
              className="w-full rounded-lg border-2 border-gray-300 bg-dark p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              accept="image/*"
            />
          </div>

          <div  className="col-span-2">
            <label
              htmlFor="blogCategory"
              className="mb-2 block text-lg font-medium text-dark dark:text-white"
            >
              Blog Category
            </label>
            <input
              type="text"
              id="blogCategory"
              name="blogCategory"
              value={formData.title} // Ensure this is mapped to the correct state
              onChange={handleChange}
              className="w-full rounded-lg border-2 border-gray-300 bg-dark p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="col-span-2">
            <label
              htmlFor="description"
              className="mb-2 block text-lg font-medium text-dark dark:text-white"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
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
            Create Blog
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
