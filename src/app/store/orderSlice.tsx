import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { API_ROUTES } from "../apiroutes"

export interface Order {
  _id: string
  user: {
    _id: string
    fullname: string
    username: string
  }
  items: Array<{
    product: string
    productname:string
    quantity: number
    price: number
  }>
  totalAmount: number
  shippingAddress: string
  paymentStatus: string
  orderStatus: string
  createdAt: string
  updatedAt: string
}

interface OrdersState {
  orders: Order[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: OrdersState = {
  orders: [],
  status: "idle",
  error: null,
}

export const fetchAllOrders = createAsyncThunk("orders/fetchAllOrders", async () => {
  const token = localStorage.getItem("token");
  console.log("Token:", token);

  const response = await fetch(API_ROUTES.GET_ALL_ORDERS, {
    headers: {
      Authorization: token,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  const data = await response.json();
  console.log("Fetched Orders Data:", data); 
  return data;
});


export const fetchBrandOrders = createAsyncThunk("orders/fetchBrandOrders", async (brandId: string) => {
  const response = await fetch(API_ROUTES.GET_BRAND_ORDERS(brandId))
  const data = await response.json()
  console.log(data) 
  if (!response.ok) {
    throw new Error("Failed to fetch brand orders")
  }
  return data
})


export const fetchProductDetails = createAsyncThunk("orders/fetchProductDetails", async (productId: string) => {
  const response = await fetch(API_ROUTES.GET_PRODUCT(productId))
  if (!response.ok) {
    throw new Error("Failed to fetch product details")
  }
  return await response.json()
})

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchAllOrders.fulfilled, (state, action: PayloadAction<{ orders: Order[] }>) => {
        state.status = "succeeded"
        state.orders = action.payload.orders
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch orders"
      })
      .addCase(fetchBrandOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBrandOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchBrandOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        console.log("Updating productDetails in Redux:", action.payload);
      
      
      })
      
  },
})

export default ordersSlice.reducer

