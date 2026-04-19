import axios from "axios";
import BASEURL from "../../BaseUrl";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAuthHeaders } from "../../utils/getAuthHeaders";

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASEURL}/api/create-product`,
        formData,
        {
          ...getAuthHeaders(thunkAPI),
          headers: {
            ...getAuthHeaders(thunkAPI).headers,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create product",
      );
    }
  },
);
let cancelToken;
export const getProductsByUserId = createAsyncThunk(
  "product/getProductsByUserId",
  async (payload, thunkAPI) => {
    try {
      if (cancelToken) {
        cancelToken.cancel("New request initiated, cancelling previous one");
      }
      cancelToken = axios.CancelToken.source();

      const response = await axios.post(
        `${BASEURL}/api/get-products-by-user-id`,
        payload,
        {
          ...getAuthHeaders(thunkAPI),
          cancelToken: cancelToken.token,
        },
      );
      return {
        products: response.data.products,
        total: response.data.total,
      };
    } catch (error) {
      // 🚀 Ignore cancelled requests
      if (axios.isCancel(error)) {
        return thunkAPI.rejectWithValue("REQUEST_CANCELLED");
      }

      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch products.",
      );
    }
  },
);
export const fetchProductById = createAsyncThunk(
  "product/fetchProductById",
  async (productId, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASEURL}/api/get-product/${productId}`,
        getAuthHeaders(thunkAPI),
      );
      return response.data.products;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch product details",
      );
    }
  },
);

// Async thunk for updating product data (used in updateProduct)
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, formData }, thunkAPI) => {
    // remove rejectWithValue from third parameter
    try {
      const response = await axios.put(
        `${BASEURL}/api/edit-product/${id}`,
        formData,
        getAuthHeaders(thunkAPI),
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to update product."); // Use rejectWithValue from thunkAPI
    }
  },
);

// Async thunk for deleteProduct a product
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, thunkAPI) => {
    try {
      const res = await axios.delete(
        `${BASEURL}/api/delete-product/${id}`,
        getAuthHeaders(thunkAPI), // Ensure headers are passed correctly
      );
      return res.data;
    } catch (error) {
      // Reject with value if the request fails
      return thunkAPI.rejectWithValue("Failed to delete product.");
    }
  },
);
