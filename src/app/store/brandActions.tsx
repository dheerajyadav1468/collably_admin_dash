import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_ROUTES } from "../../app/apiroutes";
import { Brand } from "./brandSlice"; // Import Brand type

export const createBrand = createAsyncThunk(
  "brands/createBrand",
  async (brandData: Omit<Brand, "_id">, { rejectWithValue }) => {
    try {
      const response = await fetch(API_ROUTES.CREATE_BRAND, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brandData),
      });

      if (!response.ok) throw new Error("Failed to create brand");
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllBrands = createAsyncThunk(
  "brands/fetchAllBrands",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_ROUTES.GET_ALL_BRANDS);
      if (!response.ok) throw new Error("Failed to fetch brands");
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBrand = createAsyncThunk(
  "brands/fetchBrand",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(API_ROUTES.GET_BRAND(id));
      if (!response.ok) throw new Error("Failed to fetch brand");
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteBrand = createAsyncThunk(
  "brands/deleteBrand",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(API_ROUTES.DELETE_BRAND(id), { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete brand");
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBrand = createAsyncThunk(
  "brands/updateBrand",
  async ({ id, brandData }: { id: string; brandData: Partial<Brand> }, { rejectWithValue }) => {
    try {
      const response = await fetch(API_ROUTES.UPDATE_BRAND(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brandData),
      });

      if (!response.ok) throw new Error("Failed to update brand");
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
