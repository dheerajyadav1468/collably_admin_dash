"use client"; // Ensure this component runs on the client side

import React, { useState } from 'react';

type BrandOnboardingFormProps = {
  onSubmit: (formData: BrandFormData) => void;
};

type BrandFormData = {
  brandName: string;
  brandLogo: File | null;
  brandDescription: string;
  brandCategory: string;
  contactEmail: string;
  brandWebsite: string;
  brandPhone: string;
  socialMediaLinks: string;
  gstNumber: string;
};

const BrandOnboardingForm: React.FC<BrandOnboardingFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<BrandFormData>({
    brandName: '',
    brandLogo: null,
    brandDescription: '',
    brandCategory: '',
    contactEmail: '',
    brandWebsite: '',
    brandPhone: '',
    socialMediaLinks: '',
    gstNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prevData) => ({
      ...prevData,
      brandLogo: file,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-lg dark:bg-gray-dark space-y-6">
      <h4 className="text-3xl font-semibold text-dark dark:text-white mb-6">Brand Onboarding Form</h4>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Brand Name */}
          <div>
            <label htmlFor="brandName" className="block text-lg font-medium text-dark dark:text-white mb-2">Name</label>
            <input
              type="text"
              id="brandName"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none  bg-dark focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your brand name"
              required
            />
          </div>

          {/* Brand Logo */}
          <div>
            <label htmlFor="brandLogo" className="block text-lg font-medium text-dark dark:text-white mb-2">Logo</label>
            <input
              type="file"
              id="brandLogo"
              name="brandLogo"
              onChange={handleFileChange}
              className="w-full p-4 border-2 border-gray-300  bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              accept="image/*"
            />
          </div>

          {/* Brand Description */}
          <div className="col-span-2">
            <label htmlFor="brandDescription" className="block text-lg font-medium text-dark dark:text-white mb-2">Description</label>
            <textarea
              id="brandDescription"
              name="brandDescription"
              value={formData.brandDescription}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300  bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe your brand"
              required
            />
          </div>

          {/* Brand Category */}
          <div>
            <label htmlFor="brandCategory" className="block text-lg font-medium text-dark dark:text-white mb-2">Product Category</label>
            <select
              id="brandCategory"
              name="brandCategory"
              value={formData.brandCategory}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300  bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select Category</option>
              <option value="fashion">Fashion</option>
              <option value="electronics">Electronics</option>
              <option value="home">Home</option>
              <option value="beauty">Beauty</option>
              <option value="sports">Sports</option>
              <option value="food">Food</option>
            </select>
          </div>

          {/* Contact Email */}
          <div>
            <label htmlFor="contactEmail" className="block text-lg font-medium text-dark dark:text-white mb-2">Email Id</label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300  bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter contact email"
              required
            />
          </div>

          {/* Brand Website */}
          <div>
            <label htmlFor="brandWebsite" className="block text-lg font-medium text-dark dark:text-white mb-2">Website URL</label>
            <input
              type="url"
              id="brandWebsite"
              name="brandWebsite"
              value={formData.brandWebsite}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300  bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://www.example.com"
              required
            />
          </div>

          {/* Brand Phone */}
          <div>
            <label htmlFor="brandPhone" className="block text-lg font-medium text-dark dark:text-white mb-2">Contact Number</label>
            <input
              type="tel"
              id="brandPhone"
              name="brandPhone"
              value={formData.brandPhone}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300  bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter phone number"
            />
          </div>

          {/* Social Media Links */}
          <div className="col-span-2">
            <label htmlFor="socialMediaLinks" className="block text-lg font-medium text-dark dark:text-white mb-2">Social Media Links</label>
            <textarea
              id="socialMediaLinks"
              name="socialMediaLinks"
              value={formData.socialMediaLinks}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300  bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Paste social media links"
            />
          </div>

          {/* GST Number */}
          <div>
            <label htmlFor="gstNumber" className="block text-lg font-medium text-dark dark:text-white mb-2">GST Number</label>
            <input
              type="text"
              id="gstNumber"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              className="w-[60rem]  p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter GST number"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="w-full md:w-1/3 py-4 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default BrandOnboardingForm;
