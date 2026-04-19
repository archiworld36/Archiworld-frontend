// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCategory,
  fetchSubCategory,
  createCategory,
  createSubCategory,
  updateCategory,
  updateSubCategory,
  deleteCategory,
  deleteSubCategory,
  fetchSubSubCategory,
  createSubSubCategory,
  updateSubSubCategory,
  deleteSubSubCategory,
} from "./categoriesAPI";

export const initialState = {
  categories: [],
  subCategories: [],
  subSubCategories: {},
  loadingCategories: false,
  loadingSubCategories: false,
  loadingSubSubCategories: false,
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategory.pending, (state) => {
        state.loadingCategories = true;
        state.error = null;
      })
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.loadingCategories = false;
        state.categories = action.payload; // Set the list of categories
      })
      .addCase(fetchCategory.rejected, (state, action) => {
        state.loadingCategories = false;
        state.error = action.error.message;
      })
      // Fetch sub-categories
      .addCase(fetchSubCategory.pending, (state) => {
        state.loadingSubCategories = true;
        state.error = null;
      })
      .addCase(fetchSubCategory.fulfilled, (state, action) => {
        state.loadingSubCategories = false;
        state.subCategories = action.payload; // Set the list of subCategories
      })
      .addCase(fetchSubCategory.rejected, (state, action) => {
        state.loadingSubCategories = false;
        state.error = action.error.message;
      })
      // Fetch sub-sub-categories
      .addCase(fetchSubSubCategory.pending, (state) => {
        state.loadingSubSubCategories = true;
        state.error = null;
      })
      .addCase(fetchSubSubCategory.fulfilled, (state, action) => {
        state.loadingSubSubCategories = false;
        const { subCategoryId, data } = action.payload;
        state.subSubCategories[subCategoryId] = data;
      })
      .addCase(fetchSubSubCategory.rejected, (state, action) => {
        state.loadingSubSubCategories = false;
        state.error = action.error.message;
      })
      // Create new category
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload); // Add the new category to the list
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
      })
      //create new sub-category
      .addCase(createSubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategories.push(action.payload); // Add the new sub-category to the list
      })
      .addCase(createSubCategory.rejected, (state, action) => {
        state.loading = false;
      })
      //create new sub-category
      .addCase(createSubSubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.subSubCategories.push(action.payload); // Add the new sub-category to the list
      })
      .addCase(createSubSubCategory.rejected, (state, action) => {
        state.loading = false;
      })
      // Update category
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.success = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCategory = action.payload.data;
        state.categories = state.categories.map((cat) =>
          cat._id === updatedCategory._id ? updatedCategory : cat,
        );
        state.success = "Category updated successfully.";
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
      })
      // Update sub-category
      .addCase(updateSubCategory.pending, (state) => {
        state.loading = true;
        state.success = null;
      })
      .addCase(updateSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCategory = action.payload.data;
        state.subCategories = state.subCategories.map((subCat) =>
          subCat._id === updatedCategory._id ? updatedCategory : subCat,
        );
        state.success = "Sub-category updated successfully.";
      })
      .addCase(updateSubCategory.rejected, (state, action) => {
        state.loading = false;
      })
      // Update sub-category
      .addCase(updateSubSubCategory.pending, (state) => {
        state.loading = true;
        state.success = null;
      })
      .addCase(updateSubSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        const updatedSubCategory = action.payload.data;
        state.subSubCategories = state.subSubCategories.map((subSubCat) =>
          subSubCat._id === updatedSubCategory._id
            ? updatedSubCategory
            : subSubCat,
        );
        state.success = "Sub-Sub-category updated successfully.";
      })
      .addCase(updateSubSubCategory.rejected, (state, action) => {
        state.loading = false;
      })
      // delete category
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Category deleted successfully.";
        state.categories = state.categories.filter(
          (cat) => cat._id !== action.payload.id,
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // delete sub-category
      .addCase(deleteSubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Sub-category deleted successfully.";
        state.subCategories = state.subCategories.filter(
          (subCat) => subCat._id !== action.payload.id,
        );
      })
      .addCase(deleteSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // delete sub-sub-category
      .addCase(deleteSubSubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteSubSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Sub-Sub-category deleted successfully.";
        state.subSubCategories = state.subSubCategories.filter(
          (subSubCat) => subSubCat._id !== action.payload.id,
        );
      })
      .addCase(deleteSubSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const categoryReducer = categorySlice.reducer;
