export const API_ROUTES = {
    CREATE_BRAND: 'http://127.0.0.1:5000/api/createbrand',
    GET_ALL_BRANDS: 'http://127.0.0.1:5000/api/brands',
    GET_BRAND: (id: string) => `http://127.0.0.1:5000/api/brand/${id}`,
    DELETE_BRAND: (id: string) => `http://127.0.0.1:5000/api/brand/${id}`,
    UPDATE_BRAND: (id: string) => `http://127.0.0.1:5000/api/brandupdate/${id}`,
  };
  
  