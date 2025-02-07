export const API_ROUTES = {
  // Brand routes
  CREATE_BRAND: "http://127.0.0.1:5000/api/createbrand",
  GET_ALL_BRANDS: "http://127.0.0.1:5000/api/brands",
  GET_BRAND: (id: string) => `http://127.0.0.1:5000/api/brand/${id}`,
  DELETE_BRAND: (id: string) => `http://127.0.0.1:5000/api/brand/${id}`,
  UPDATE_BRAND: (id: string) => `http://127.0.0.1:5000/api/brandupdate/${id}`,
  // Product routes
  CREATE_PRODUCT: "http://127.0.0.1:5000/api/create/product",
  GET_ALL_PRODUCTS: "http://127.0.0.1:5000/api/getallproducts",
  GET_PRODUCT: (id: string) => `http://127.0.0.1:5000/api/product/${id}`,
  DELETE_PRODUCT: (id: string) => `http://127.0.0.1:5000/api/deleteproduct/${id}`,
  UPDATE_PRODUCT: (id: string) => `http://127.0.0.1:5000/api/updateproduct/${id}`,
  // User routes
  CREATE_USER: "http://127.0.0.1:5000/api/register",
  GET_ALL_USERS: "http://127.0.0.1:5000/api/user",
  GET_USER: (id: string) => `http://127.0.0.1:5000/api/user/${id}`,
  UPDATE_USER: "http://127.0.0.1:5000/api/user",
  FOLLOW_USER: (id: string) => `http://127.0.0.1:5000/api/user/${id}/follow`,
  UNFOLLOW_USER: (id: string) => `http://127.0.0.1:5000/api/user/${id}/unfollow`,
  SEARCH_USER: "http://127.0.0.1:5000/api/search",
  SUGGESTIONS_USER: "http://127.0.0.1:5000/api/suggestionsUser",
  // Order routes
  GET_ALL_ORDERS: "http://127.0.0.1:5000/api/getallorders",

  ADMIN_LOGIN: "http://127.0.0.1:5000/api/admin_login",
}

