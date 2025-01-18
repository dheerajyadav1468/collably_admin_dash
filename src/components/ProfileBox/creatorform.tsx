"use client"; 
import React, { useState } from 'react';

type CreatorOnboardingFormProps = {
  onSubmit: (formData: CreatorFormData) => void;
};

type CreatorFormData = {
  creatorName: string;
  creatorPhoto: File | null;
  creatorBio: string;
  creatorCategory: string;
  contactEmail: string;
  creatorWebsite: string;
  creatorPhone: string;
  socialMediaLinks: string;
  paypalAccount: string;
};

const CreatorOnboardingForm: React.FC<CreatorOnboardingFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<CreatorFormData>({
    creatorName: '',
    creatorPhoto: null,
    creatorBio: '',
    creatorCategory: '',
    contactEmail: '',
    creatorWebsite: '',
    creatorPhone: '',
    socialMediaLinks: '',
    paypalAccount: '',
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
      creatorPhoto: file,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-lg dark:bg-gray-dark space-y-6">
      <h4 className="text-3xl font-semibold text-dark dark:text-white mb-6">Creator Onboarding Form</h4>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Creator Name */}
          <div>
            <label htmlFor="creatorName" className="block text-lg font-medium text-dark dark:text-white mb-2">Full Name</label>
            <input
              type="text"
              id="creatorName"
              name="creatorName"
              value={formData.creatorName}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none bg-dark focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Creator Photo */}
          <div>
            <label htmlFor="creatorPhoto" className="block text-lg font-medium text-dark dark:text-white mb-2">Photo</label>
            <input
              type="file"
              id="creatorPhoto"
              name="creatorPhoto"
              onChange={handleFileChange}
              className="w-full p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              accept="image/*"
            />
          </div>

          {/* Creator Bio */}
          <div className="col-span-2">
            <label htmlFor="creatorBio" className="block text-lg font-medium text-dark dark:text-white mb-2">Bio</label>
            <textarea
              id="creatorBio"
              name="creatorBio"
              value={formData.creatorBio}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe yourself"
              required
            />
          </div>

          {/* Creator Category */}
          {/* <div>
            <label htmlFor="creatorCategory" className="block text-lg font-medium text-dark dark:text-white mb-2">Creator Category</label>
            <select
              id="creatorCategory"
              name="creatorCategory"
              value={formData.creatorCategory}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select Category</option>
              <option value="fashion">Fashion</option>
              <option value="gaming">Gaming</option>
              <option value="beauty">Beauty</option>
              <option value="music">Music</option>
              <option value="travel">Travel</option>
              <option value="fitness">Fitness</option>
            </select>
          </div> */}

          {/* Contact Email */}
          <div>
            <label htmlFor="contactEmail" className="block text-lg font-medium text-dark dark:text-white mb-2">Email Id</label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter contact email"
              required
            />
          </div>

          {/* Creator Website */}
          {/* <div>
            <label htmlFor="creatorWebsite" className="block text-lg font-medium text-dark dark:text-white mb-2">Website URL</label>
            <input
              type="url"
              id="creatorWebsite"
              name="creatorWebsite"
              value={formData.creatorWebsite}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://www.example.com"
              required
            />
          </div> */}

          {/* Creator Phone */}
          <div>
            <label htmlFor="creatorPhone" className="block text-lg font-medium text-dark dark:text-white mb-2">Contact Number</label>
            <input
              type="tel"
              id="creatorPhone"
              name="creatorPhone"
              value={formData.creatorPhone}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              className="w-full p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Paste social media links"
            />
          </div>

          {/* PayPal Account */}
          <div>
            <label htmlFor="paypalAccount" className="block text-lg font-medium text-dark dark:text-white mb-2">PayPal Account</label>
            <input
              type="email"
              id="paypalAccount"
              name="paypalAccount"
              value={formData.paypalAccount}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter PayPal account email"
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

export default CreatorOnboardingForm;
