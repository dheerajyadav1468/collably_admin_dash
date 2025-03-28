const BASE_URL = "http://127.0.0.1:5000/api";

export const API_ROUTES = {
  // Brand routes
  CREATE_BRAND: `${BASE_URL}/createbrand`,
  GET_ALL_BRANDS: `${BASE_URL}/brands`,
  GET_BRAND: (id: string) => `${BASE_URL}/brand/${id}`,
  DELETE_BRAND: (id: string) => `${BASE_URL}/brand/${id}`,
  UPDATE_BRAND: (id: string) => `${BASE_URL}/brands/${id}`,
   
  // Product routes
  CREATE_PRODUCT: `${BASE_URL}/create/product`,
  GET_ALL_PRODUCTS: `${BASE_URL}/getallproducts`,
  GET_PRODUCT: (id: string) => `${BASE_URL}/product/${id}`,
  DELETE_PRODUCT: (id: string) => `${BASE_URL}/deleteproduct/${id}`,
  UPDATE_PRODUCT: (id: string) => `${BASE_URL}/updateproduct/${id}`,
  
  // User routes
  CREATE_USER: `${BASE_URL}/register`,
  GET_ALL_USERS: `${BASE_URL}/user`,
  GET_USER: (id: string) => `${BASE_URL}/user/${id}`,
  UPDATE_USER: `${BASE_URL}/user`,
  FOLLOW_USER: (id: string) => `${BASE_URL}/user/${id}/follow`,
  UNFOLLOW_USER: (id: string) => `${BASE_URL}/user/${id}/unfollow`,
  SEARCH_USER: `${BASE_URL}/search`,
  SUGGESTIONS_USER: `${BASE_URL}/suggestionsUser`,
  
  // Order routes
  GET_ALL_ORDERS: `${BASE_URL}/getall/orders`,
  GET_ORDER: (id: string) => `${BASE_URL}/order/${id}`,

  // Auth routes
  ADMIN_LOGIN: `${BASE_URL}/admin_login`,
  BRAND_LOGIN: `${BASE_URL}/brandlogin`,
  
  // Brand-specific routes
  GET_BRAND_PRODUCTS: `${BASE_URL}/brand/products`,
  GET_BRAND_ORDERS: (brandId: string) => `${BASE_URL}/brand/${brandId}/orders`,

  
  GET_ALL_REFERRALS: `${BASE_URL}/referrals`,
GET_BRAND_REFERRALS: (brandId: string) => `${BASE_URL}/referral/brand/${brandId}`,
};