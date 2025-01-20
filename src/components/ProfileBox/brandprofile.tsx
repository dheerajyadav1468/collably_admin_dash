"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store/store";
import { fetchBrand } from "../../app/store/brandSlice";
import { fetchAllProducts } from "../../app/store/prductSlice";
import Link from "next/link";
import Image from "next/image";

const ProfileBrand = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const brandId = searchParams.get("id");
  const { currentBrand, status, error } = useSelector(
    (state: RootState) => state.brands,
  );
  const {
    products,
    status: productStatus,
    error: productError,
  } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    if (brandId) {
      dispatch(fetchBrand(brandId));
    }
    dispatch(fetchAllProducts());
  }, [dispatch, brandId]);

  const handleEditClick = () => {
    if (brandId) {
      router.push(`/brandForm?id=${brandId}`);
    }
  };

  if (status === "loading" || productStatus === "loading")
    return <div>Loading...</div>;
  if (status === "failed") return <div>Error: {error}</div>;
  if (productStatus === "failed")
    return <div>Error loading products: {productError}</div>;
  if (!currentBrand) return <div>No brand found</div>;

  const brandProducts = products.filter(
    (product) => product.brandId === brandId,
  );

  return (
    <div className="max-w-6xl rounded-lg bg-white p-6 shadow-md dark:bg-gray-dark">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          {currentBrand.brandName} - Brand Details
        </h2>
        <button
          onClick={handleEditClick}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Edit Brand
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-lg font-semibold">Brand Information</h3>
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
            {currentBrand.brandName
              ? currentBrand.brandName.charAt(0).toUpperCase()
              : ""}
          </div>
          <p>
            <strong>Category:</strong> {currentBrand.brandCategory}
          </p>
          <p>
            <strong>Description:</strong> {currentBrand.brandDescription}
          </p>
        </div>
        <div>
          <h3 className="mb-2 text-lg font-semibold">Contact Information</h3>
          <p>
            <strong>Email:</strong> {currentBrand.contactEmail}
          </p>
          <p>
            <strong>Website:</strong> {currentBrand.brandWebsite}
          </p>
          <p>
            <strong>Phone:</strong> {currentBrand.brandPhoneNumber}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="mb-2 text-lg font-semibold">Social Media Links</h3>
        {currentBrand?.socialMediaLinks ? (
          <>
          <div className="grid grid-cols-2 ">
            <p className="flex gap-3 mb-2">
              <strong>
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 50 50"
                  width="25px"
                  height="25px"
                  fill="white"
                >
                  {" "}
                  <path d="M25,3C12.85,3,3,12.85,3,25c0,11.03,8.125,20.137,18.712,21.728V30.831h-5.443v-5.783h5.443v-3.848 c0-6.371,3.104-9.168,8.399-9.168c2.536,0,3.877,0.188,4.512,0.274v5.048h-3.612c-2.248,0-3.033,2.131-3.033,4.533v3.161h6.588 l-0.894,5.783h-5.694v15.944C38.716,45.318,47,36.137,47,25C47,12.85,37.15,3,25,3z" />
                </svg>
              </strong>{" "}
              {currentBrand.socialMediaLinks.facebook || "Not Available"}
            </p>
            <p className="flex gap-3 mb-2">
              <strong><svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="25px" height="25px" fill="white"><path d="M 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 L 11 4 z M 13.085938 13 L 21.023438 13 L 26.660156 21.009766 L 33.5 13 L 36 13 L 27.789062 22.613281 L 37.914062 37 L 29.978516 37 L 23.4375 27.707031 L 15.5 37 L 13 37 L 22.308594 26.103516 L 13.085938 13 z M 16.914062 15 L 31.021484 35 L 34.085938 35 L 19.978516 15 L 16.914062 15 z"/></svg></strong>{" "}
              {currentBrand.socialMediaLinks.twitter || "Not Available"}
            </p>
            <p className="flex gap-3 mb-2">
              <strong><svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="25px" height="25px" fill="white"><path d="M 16 3 C 8.8324839 3 3 8.8324839 3 16 L 3 34 C 3 41.167516 8.8324839 47 16 47 L 34 47 C 41.167516 47 47 41.167516 47 34 L 47 16 C 47 8.8324839 41.167516 3 34 3 L 16 3 z M 16 5 L 34 5 C 40.086484 5 45 9.9135161 45 16 L 45 34 C 45 40.086484 40.086484 45 34 45 L 16 45 C 9.9135161 45 5 40.086484 5 34 L 5 16 C 5 9.9135161 9.9135161 5 16 5 z M 37 11 A 2 2 0 0 0 35 13 A 2 2 0 0 0 37 15 A 2 2 0 0 0 39 13 A 2 2 0 0 0 37 11 z M 25 14 C 18.936712 14 14 18.936712 14 25 C 14 31.063288 18.936712 36 25 36 C 31.063288 36 36 31.063288 36 25 C 36 18.936712 31.063288 14 25 14 z M 25 16 C 29.982407 16 34 20.017593 34 25 C 34 29.982407 29.982407 34 25 34 C 20.017593 34 16 29.982407 16 25 C 16 20.017593 20.017593 16 25 16 z"/></svg></strong>{" "}
              {currentBrand.socialMediaLinks.instagram || "Not Available"}
            </p>
            <p className="flex gap-3 mb-2">
              <strong><svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="25px" height="25px" fill="white">    <path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z"/></svg></strong>{" "}
              {currentBrand.socialMediaLinks.linkedin || "Not Available"}
            </p>
            </div>
          </>
        ) : (
          <p>No social media links available</p>
        )}
      </div>
      <div className="mt-4">
        <h3 className="mb-2 text-lg font-semibold">Additional Information</h3>
        <p>
          <strong>GST Number:</strong> {currentBrand.gstNumber}
        </p>
      </div>
      <div className="mt-6">
        <h3 className="mb-4 text-xl font-semibold"></h3>
        {brandProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border px-4 py-2 text-left">Name</th>
                  <th className="border px-4 py-2 text-left">Category</th>
                  <th className="border px-4 py-2 text-left">Price</th>
                  <th className="border px-4 py-2 text-left">Status</th>
                  <th className="border px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {brandProducts.map((product) => (
                  <tr key={product._id} className="border-b">
                    <td className="border px-4 py-2">{product.productname}</td>
                    <td className="border px-4 py-2">{product.category}</td>
                    <td className="border px-4 py-2">${product.price}</td>
                    <td className="border px-4 py-2">{product.status}</td>
                    <td className="border px-4 py-2">
                      <Link
                        href={`/profileProduct?id=${product._id}`}
                        className="text-blue-500 hover:text-blue-700 "
                      >
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
                            d="M9.99935 2.70825C6.23757 2.70825 3.70376 4.96175 2.23315 6.8723L2.20663 6.90675C1.87405 7.3387 1.56773 7.73652 1.35992 8.20692C1.13739 8.71064 1.04102 9.25966 1.04102 9.99992C1.04102 10.7402 1.13739 11.2892 1.35992 11.7929C1.56773 12.2633 1.87405 12.6611 2.20664 13.0931L2.23316 13.1275C3.70376 15.0381 6.23757 17.2916 9.99935 17.2916C13.7611 17.2916 16.2949 15.0381 17.7655 13.1275L17.792 13.0931C18.1246 12.6612 18.431 12.2633 18.6388 11.7929C18.8613 11.2892 18.9577 10.7402 18.9577 9.99992C18.9577 9.25966 18.8613 8.71064 18.6388 8.20692C18.431 7.73651 18.1246 7.33868 17.792 6.90673L17.7655 6.8723C16.2949 4.96175 13.7611 2.70825 9.99935 2.70825ZM3.2237 7.63475C4.58155 5.87068 6.79132 3.95825 9.99935 3.95825C13.2074 3.95825 15.4172 5.87068 16.775 7.63475C17.1405 8.10958 17.3546 8.3933 17.4954 8.71204C17.627 9.00993 17.7077 9.37403 17.7077 9.99992C17.7077 10.6258 17.627 10.9899 17.4954 11.2878C17.3546 11.6065 17.1405 11.8903 16.775 12.3651C15.4172 14.1292 13.2074 16.0416 9.99935 16.0416C6.79132 16.0416 4.58155 14.1292 3.2237 12.3651C2.85821 11.8903 2.64413 11.6065 2.50332 11.2878C2.37171 10.9899 2.29102 10.6258 2.29102 9.99992C2.29102 9.37403 2.37171 9.00993 2.50332 8.71204C2.64413 8.3933 2.85821 8.10958 3.2237"
                            fill=""
                          />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No products found for this brand.</p>
        )}
      </div>
    </div>
  );
};

export default ProfileBrand;
