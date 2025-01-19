'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store/store';
import { fetchBrand } from '../../app/store/brandSlice';
import TableTwo from "../Tables/TableTwo";

const ProfileBrand = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const brandId = searchParams.get('id');
  const { currentBrand, status, error } = useSelector((state: RootState) => state.brands);

  useEffect(() => {
    if (brandId) {
      dispatch(fetchBrand(brandId));
    }
  }, [dispatch, brandId]);

  const handleEditClick = () => {
    if (brandId) {
      router.push(`/brandForm?id=${brandId}`);
    }
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;
  if (!currentBrand) return <div>No brand found</div>;

  return (
    <div className="p-6 max-w-6xl bg-white dark:bg-gray-dark rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          {currentBrand.brandName} - Brand Details
        </h2>
        <button
          onClick={handleEditClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Edit Brand
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Brand Information</h3>

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-bold text-lg">
  {currentBrand.brandName ? currentBrand.brandName.charAt(0).toUpperCase() : ''}
</div>
          <p><strong>Category:</strong> {currentBrand.brandCategory}</p>
          <p><strong>Description:</strong> {currentBrand.brandDescription}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
          <p><strong>Email:</strong> {currentBrand.contactEmail}</p>
          <p><strong>Website:</strong> {currentBrand.brandWebsite}</p>
          <p><strong>Phone:</strong> {currentBrand.brandPhoneNumber}</p>
        </div>
      </div>
      <div className="mt-4">
  <h3 className="text-lg font-semibold mb-2">Social Media Links</h3>
  {currentBrand?.socialMediaLinks ? (
    <>
      <p><strong>Facebook:</strong> {currentBrand.socialMediaLinks.facebook || 'Not Available'}</p>
      <p><strong>Twitter:</strong> {currentBrand.socialMediaLinks.twitter || 'Not Available'}</p>
      <p><strong>Instagram:</strong> {currentBrand.socialMediaLinks.instagram || 'Not Available'}</p>
      <p><strong>LinkedIn:</strong> {currentBrand.socialMediaLinks.linkedin || 'Not Available'}</p>
    </>
  ) : (
    <p>No social media links available</p>
  )}
</div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
        <p><strong>GST Number:</strong> {currentBrand.gstNumber}</p>
      </div>
    </div>
  );
};

export default ProfileBrand;

