import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_ROUTES } from '../apiroutes';

export interface Brand {
  brandName: string;
  brandDescription: string;
  brandCategory: string;
  contactEmail: string;
  brandWebsite: string;
  brandPhoneNumber: string;
  socialMediaLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
  gstNumber: string;
}

interface BrandsState {
  brands: Brand[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BrandsState = {
  brands: [],
  status: 'idle',
  error: null,
};

export const createBrand = createAsyncThunk(
  'brands/createBrand',
  async (brandData: Omit<Brand, 'id'>) => {
    const response = await fetch(API_ROUTES.CREATE_BRAND, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(brandData),
    });
    if (!response.ok) {
      throw new Error('Failed to create brand');
    }
    return await response.json();
  }
);

const brandsSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBrand.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createBrand.fulfilled, (state, action: PayloadAction<Brand>) => {
        state.status = 'succeeded';
        state.brands.push(action.payload);
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to create brand';
      });
  },
});

export default brandsSlice.reducer;

