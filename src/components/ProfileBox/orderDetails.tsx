"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { fetchAllOrders } from "../../app/store/orderSlice";
import { RootState, AppDispatch } from "../../app/store/store";

export default function OrderDetails() {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch<AppDispatch>();


  const { orderDetails, status, error } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    if (id) {
      dispatch(fetchAllOrders()); 
    }
  }, [id, dispatch]); 
  if (status === "loading") return <div>Loading...</div>; 
  if (status === "failed") return <div>Error: {error}</div>; 

  return (
    <div>
      <h1>Order Details</h1>
      {orderDetails && (
        <div>
          <h2>Order ID: {orderDetails._id}</h2>
          <p>User: {orderDetails.user.fullname}</p>
          <p>Total Amount: ₹{orderDetails.totalAmount}</p>
          <h3>Items:</h3>
          <ul>
            {orderDetails.items.map((item, index) => (
              <li key={index}>
                {item.productname} - Quantity: {item.quantity} - Price: ₹{item.price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
