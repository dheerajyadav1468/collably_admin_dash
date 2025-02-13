"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store/store";
import {
  fetchAllOrders,
  fetchBrandOrders,
  fetchProductDetails,
} from "../../app/store/orderSlice";
import { Filter, Search } from "lucide-react";

interface Order {
  _id: string;
  user: {
    _id: string;
    fullname: string;
    username: string;
  };
  items: Array<{
    product: string | { _id: string; productname: string }; // Assuming product can be a string or an object
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
}

interface ProductDetails {
  _id: string;
  productname: string;
}

export default function OrderTable() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { orders, status, error } = useSelector(
    (state: RootState) => state.orders
  );
  const [productDetails, setProductDetails] = useState<{
    [key: string]: ProductDetails;
  }>({});

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    user: "",
    product: "",
    status: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType === "admin") {
      dispatch(fetchAllOrders());
    } else if (userType !== "admin") {
      const brandId = localStorage.getItem("brandId");
      if (brandId) {
        dispatch(fetchBrandOrders(brandId));
      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (!Array.isArray(orders) || orders.length === 0) return;

    const productIdsToFetch = new Set<string>();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (typeof item.product === "string" && !productDetails[item.product]) {
          productIdsToFetch.add(item.product); // Collect missing product IDs
        }
      });
    });

    // Fetch details for missing product IDs
    productIdsToFetch.forEach((productId) => {
      dispatch(fetchProductDetails(productId)).then((response) => {
        if (response.payload) {
          setProductDetails((prev) => ({
            ...prev,
            [productId]: response.payload,
          }));
        }
      });
    });
  }, [orders, dispatch]);

  useEffect(() => {
    console.log("Current productDetails:", productDetails);
  }, [productDetails]);

  const handleViewClick = (orderId: string) => {
    router.push(`/orderDetails?id=${orderId}`);
  };
  

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const filteredOrders = (orders || []).filter((order: Order) => {
    return (
      (!filters.user ||
        order.user.fullname
          .toLowerCase()
          .includes(filters.user.toLowerCase())) &&
      (!filters.product ||
        order.items.some((item) =>
          (productDetails[item.product as keyof typeof productDetails]?.productname || "")
  .toLowerCase()
  .includes(filters.product.toLowerCase())
        )
        )) &&
      (!filters.status ||
        order.orderStatus.toLowerCase() === filters.status.toLowerCase()) &&
      (!searchTerm ||
        order.user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some((item) =>
          (productDetails[item.product as keyof typeof productDetails]?.productname || "")
        .toLowerCase()
        .includes(filters.product.toLowerCase())
        )      
    );
  });

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error: {error}</div>;

  return (
    <div className="w-full rounded-lg bg-dark p-4 text-gray">
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Orders</h1>
          <div className="flex gap-2">
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
            <input
              type="text"
              value={filters.user}
              onChange={(e) => handleFilterChange("user", e.target.value)}
              placeholder="Filter by user"
              className="w-full rounded-md border bg-black p-2 text-gray"
            />
            <input
              type="text"
              value={filters.product}
              onChange={(e) => handleFilterChange("product", e.target.value)}
              placeholder="Filter by product"
              className="w-full rounded-md border bg-black p-2 text-gray"
            />
          </div>
        )}

        <div className="relative mt-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by user or product"
            className="w-full rounded-md border bg-black p-2 pl-10"
          />
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-500" />
        </div>
      </div>

      <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-stroke dark:border-dark-3">
              <th className="px-2 pb-3.5 text-left text-sm font-medium uppercase xsm:text-base">
                Order ID
              </th>
              <th className="px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base">
                User
              </th>
              <th className="px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base">
                Product
              </th>
              <th className="px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base">
                Total Amount
              </th>
              <th className="px-2 pb-3.5 text-center text-sm font-medium uppercase xsm:text-base">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, key) => (
              <tr
                key={order._id}
                className={
                  key === filteredOrders.length - 1
                    ? ""
                    : "border-b border-stroke dark:border-dark-3"
                }
              >
                <td className="px-2 py-4 text-left font-medium text-dark dark:text-white">
                  {order._id}
                </td>
                <td className="px-2 py-4 text-center font-medium text-dark dark:text-white">
                  {order.user.fullname}
                </td>
                <td
                  className="px-2 py-4 text-center font-medium text-dark dark:text-white"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {order.items.map((item, index) => {
                    console.log("Checking item:", item);

                    if (!item.product) {
                      console.error("Error: item.product is missing!", item);
                      return <span key={index}>Error loading product</span>;
                    }

                    const product =
                      typeof item.product === "string"
                        ? productDetails[item.product]
                        : item.product;

                    if (!product) {
                      console.log("Product details not loaded yet", item.product);
                      return <span key={index}>Loading...</span>;
                    }

                    return (
                      <span key={index}>
                        {product.productname}
                        {index < order.items.length - 1 ? ", " : ""}
                      </span>
                    );
                  })}
                </td>
                <td className="px-2 py-4 text-center font-medium text-green-light-1">
                  ₹{order.totalAmount}
                </td>
                <td className="px-2 py-4 text-center">
                  <button
                    className="hover:text-primary"
                    onClick={() => handleViewClick(order._id)}
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
                        d="M9.99935 2.70825C6.23757 2.70825 3.70376 4.96175 2.23315 6.8723L2.20663 6.90675C1.87405 7.3387 1.56773 7.73652 1.35992 8.20692C1.13739 8.71064 1.04102 9.25966 1.04102 9.99992C1.04102 10.7402 1.13739 11.2892 1.35992 11.7929C1.56773 12.2633 1.87405 12.6611 2.20664 13.0931L2.23316 13.1275C3.70376 15.0381 6.23757 17.2916 9.99935 17.2916C13.7611 17.2916 16.2949 15.0381 17.7655 13.1275L17.792 13.0931C18.1246 12.6612 18.431 12.2633 18.6388 11.7929C18.8613 11.2892 18.9577 10.7402 18.9577 9.99992C18.9577 9.25966 18.8613 8.71064 18.6388 8.20692C18.431 7.73651 18.1246 7.33868 17.792 6.90673L17.7655 6.8723C16.2949 4.96175 13.7611 2.70825 9.99935 2.70825ZM3.2237 7.63475C4.58155 5.87068 6.79132 3.95825 9.99935 3.95825C13.2074 3.95825 15.4172 5.87068 16.775 7.63475C17.1405 8.10958 17.3546 8.3933 17.4954 8.71204C17.627 9.00993 17.7077 9.37403 17.7077 9.99992C17.7077 10.6258 17.627 10.9899 17.4954 11.2878C17.3546 11.6065 17.1405 11.8903 16.775 12.3651C15.4172 14.1292 13.2074 16.0416 9.99935 16.0416C6.79132 16.0416 4.58155 14.1292 3.2237 12.3651C2.85814 11.8903 2.64408 11.6065 2.50329 11.2878C2.3717 10.9899 2.29102 10.6258 2.29102 9.99992C2.29102 9.37403 2.3717 9.00993 2.50329 8.71204C2.64408 8.3933 2.85814 8.10958 3.2237 7.63475Z"
                        fill=""
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
