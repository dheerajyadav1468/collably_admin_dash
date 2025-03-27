import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_ROUTES } from '../apiroutes';

export interface Referral {
  _id: string;
  userId: {
    _id: string;
    fullname: string;
  };
  referralLink: string;
  clicks: number;
  createdAt: string;
}

interface ReferralState {
  referrals: Referral[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ReferralState = {
  referrals: [],
  status: 'idle',
  error: null,
};

export const fetchReferrals = createAsyncThunk('referrals/fetchReferrals', async () => {
  const response = await fetch(API_ROUTES.GET_ALL_REFERRALS, {
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch referrals');
  }
  return await response.json();
});

const referralSlice = createSlice({
  name: 'referrals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReferrals.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReferrals.fulfilled, (state, action: PayloadAction<Referral[]>) => {
        state.status = 'succeeded';
        state.referrals = action.payload;
      })
      .addCase(fetchReferrals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch referrals';
      });
  },
});

export default referralSlice.reducer;






