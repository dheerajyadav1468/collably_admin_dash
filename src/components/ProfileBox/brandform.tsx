'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store/store';
import { fetchBrand, updateBrand, createBrand } from '../../app/store/brandSlice';
import { Brand } from '../../app/store/brandSlice';
import Modal from './Modal';

const BrandForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const brandId = searchParams.get('id');
  const { currentBrand, status, error } = useSelector((state: RootState) => state.brands);

  const [formData, setFormData] = useState<Partial<Brand>>({
    brandName: '',
    brandDescription: '',
    brandCategory: '',
    contactEmail: '',
    brandWebsite: '',
    brandPhoneNumber: '',
    socialMediaLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
    },
    gstNumber: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    if (brandId) {
      dispatch(fetchBrand(brandId));
    }
  }, [dispatch, brandId]);

  useEffect(() => {
    if (currentBrand && brandId) {
      setFormData(currentBrand);
    }
  }, [currentBrand, brandId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('socialMediaLinks.')) {
      const socialMedia = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialMediaLinks: {
          ...prev.socialMediaLinks,
          [socialMedia]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (brandId) {
        await dispatch(updateBrand({ id: brandId, brandData: formData })).unwrap();
        setModalMessage('Brand updated successfully');
      } else {
        await dispatch(createBrand(formData as Omit<Brand, '_id'>)).unwrap();
        setModalMessage('Brand created successfully');
      }
      setIsModalOpen(true);
    } catch (error) {
      alert(brandId ? 'Failed to update brand' : 'Failed to create brand');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    router.push('/brandTable');
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  return (
    <div className="max-w-6xl p-8 bg-white rounded-lg shadow-lg dark:bg-gray-dark space-y-6">
      <h4 className="text-3xl font-semibold text-dark dark:text-white mb-6">Brand Onboarding Form</h4>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2">
          {/* Brand Name */}
          <div>
            <label htmlFor="brandName" className="block text-lg font-medium text-dark dark:text-white mb-2">Name</label>
            <input
              type="text"
              id="brandName"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none bg-dark focus:ring-2 focus:ring-indigo-500"
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
              onChange={handleChange}
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
              className="w-full p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              className="w-full p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              className="w-full p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              className="w-full p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://www.example.com"
              required
            />
          </div>

          {/* Brand Phone Number */}
          <div>
            <label htmlFor="brandPhoneNumber" className="block text-lg font-medium text-dark dark:text-white mb-2">Contact Number</label>
            <input
              type="tel"
              id="brandPhoneNumber"
              name="brandPhoneNumber"
              value={formData.brandPhoneNumber}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter phone number"
            />
          </div>

          {/* Social Media Links */}
          <div  className="">
          <label htmlFor="socialMediaLinks.facebook" className="block text-lg font-medium text-dark dark:text-white mb-2">Facebook</label>
          <input
            type="url"
            id="socialMediaLinks.facebook"
            name="socialMediaLinks.facebook"
            value={formData.socialMediaLinks?.facebook}
            onChange={handleChange}
            className="w-full p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div  className="">
          <label htmlFor="socialMediaLinks.twitter" className="block text-lg font-medium text-dark dark:text-white mb-2">Twitter</label>
          <input
            type="url"
            id="socialMediaLinks.twitter"
            name="socialMediaLinks.twitter"
            value={formData.socialMediaLinks?.twitter}
            onChange={handleChange}
            className="w-full p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div  className="">
          <label htmlFor="socialMediaLinks.instagram" className="block text-lg font-medium text-dark dark:text-white mb-2">Instagram</label>
          <input
            type="url"
            id="socialMediaLinks.instagram"
            name="socialMediaLinks.instagram"
            value={formData.socialMediaLinks?.instagram}
            onChange={handleChange}
            className="w-full p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div  className="">
          <label htmlFor="socialMediaLinks.linkedin" className="block text-lg font-medium text-dark dark:text-white mb-2">LinkedIn</label>
          <input
            type="url"
            id="socialMediaLinks.linkedin"
            name="socialMediaLinks.linkedin"
            value={formData.socialMediaLinks?.linkedin}
            onChange={handleChange}
            className="w-full p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              className="w-full p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter GST number"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-lg font-medium text-dark dark:text-white mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter password"
              required
            />
          </div>
        </div>

        

        {/* Submit Button */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="w-full md:w-1/3 py-4 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {brandId ? 'Update Brand' : 'Create Brand'}
          </button>
        </div>
      </form>

      {/* Success Modal */}
      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <h2 className="text-xl font-bold mb-4">Success!</h2>
        <p>{modalMessage}</p>
      </Modal>
    </div>
  );
};

export default BrandForm;