import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import paymentTypeService from "./paymentService";
import { reset } from "../products/productSlice";
import { getPaymentTypes } from "../../../backend/controllers/paymenttype.controller";

const initialState = {
  paymentTypes: [],
  isPaymentTypesLoading: false,
  isPaymentTypesSuccess: false,
  isPaymentTypesError: false,
  message: "",
};

export const getPaymentTypes = createAsyncThunk(
  "paymentTypesState/getPaymentTypes",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await paymentTypeService.getPaymentTypes(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ??
        error.message ??
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const setPaymentType = createAsyncThunk(
  "paymentTypesState/setPaymentType",
  async (paymentType, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await paymentTypeService.setPaymentType(paymentType, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ??
        error.message ??
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updatePaymentType = createAsyncThunk(
  "paymentTypesState/updatePaymentType",
  async (payload, thunkAPI) => {
    try {
      const { paymentTypeID, updatedPaymentTypeData } = payload;
      const token = thunkAPI.getState().auth.user.token;
      return await paymentTypeService.updatePaymentType(
        paymentTypeID,
        updatedPaymentTypeData,
        token
      );
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ??
        error.message ??
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deletePaymentType = createAsyncThunk(
  "paymentTypesState/updatePaymentType",
  async (paymentTypeID, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await paymentTypeService.deletePaymentType(paymentTypeID, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ??
        error.message ??
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const paymentTypeSlice = createSlice({
  name: "paymentTypeState",
  initialState,
  reducers: {
    resetPaymentType: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(getPaymentTypes.pending, (state) => {
        state.isPaymentTypesLoading = true;
      })
      .addCase(getPaymentTypes.fulfilled, (state, action) => {
        state.isPaymentTypesLoading = false;
        state.isPaymentTypesSuccess = true;
        state.paymentTypes = action.payload;
      })
      .addCase(getPaymentTypes.rejected, (state, action) => {
        state.isPaymentTypesLoading = false;
        state.isPaymentTypesError = true;
        state.message = action.payload;
      })
      .addCase(setPaymentType.pending, (state) => {
        state.isPaymentTypesLoading = true;
      })
      .addCase(setPaymentType.fulfilled, (state, action) => {
        state.isPaymentTypesLoading = false;
        state.isPaymentTypesSuccess = true;
        state.paymentTypes = state.paymentTypes.concat(action.payload);
      })
      .addCase(setPaymentType.rejected, (state, action) => {
        state.isPaymentTypesLoading = false;
        state.isPaymentTypesError = true;
        state.message = action.payload;
      })
      .addCase(updatePaymentType.pending, (state) => {
        state.isPaymentTypesLoading = true;
      })
      .addCase(updatePaymentType.fulfilled, (state, action) => {
        state.isPaymentTypesLoading = false;
        state.isPaymentTypesSuccess = true;
        state.paymentTypes.map((payment) => {
          if (payment._id === action.payload._id) {
            payment.type_name = action.payload.type_name;
            payment.type_image = action.payload.type_image;
          }
        });
      })
      .addCase(updatePaymentType.rejected, (state, action) => {
        state.isPaymentTypesLoading = false;
        state.isPaymentTypesError = true;
        state.message = action.payload;
      })
      .addCase(deletePaymentType.pending, (state, action) => {
        state.isPaymentTypesLoading = true;
      })
      .addCase(deletePaymentType.fulfilled, (state, action) => {
        state.isPaymentTypesLoading = false;
        state.isPaymentTypesSuccess = true;
        state.paymentTypes = state.paymentTypes.filter(
          (payment) => payment._id !== action.payload._id
        );
      })
      .addCase(deletePaymentType.rejected, (state, action) => {
        state.isPaymentTypesLoading = false;
        state.isPaymentTypesError = true;
        state.message = action.payload;
      })
  },
});

export const { resetPaymentTpyes } = paymentTypeSlice.actions;
export default paymentTypeSlice.reducer;
