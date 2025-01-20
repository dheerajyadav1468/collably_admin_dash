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
}

