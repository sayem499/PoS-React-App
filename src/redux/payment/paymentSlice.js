import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import paymentTypeService from "./paymentService";

const initialState = {
  paymentTypes: [],
  isPaymentTypesLoading: false,
  isPaymentTypesSuccess: false,
  isPaymentTypesError: false,
  message: "",
};

export const allPaymentTypes = createAsyncThunk(
  "paymentTypesState/allPaymentTypes",
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
  },
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
  },
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
        token,
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
  },
);

export const deletePaymentType = createAsyncThunk(
  "paymentTypesState/deletePaymentType",
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
  },
);

export const paymentTypeSlice = createSlice({
  name: "paymentTypeState",
  initialState,
  reducers: {
    resetPaymentType: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      // Get all payment types
      .addCase(allPaymentTypes.pending, (state) => {
        state.isPaymentTypesLoading = true;
        state.isPaymentTypesError = false;
      })
      .addCase(allPaymentTypes.fulfilled, (state, action) => {
        state.isPaymentTypesLoading = false;
        state.isPaymentTypesSuccess = true;
        state.paymentTypes = action.payload;
      })
      .addCase(allPaymentTypes.rejected, (state, action) => {
        state.isPaymentTypesLoading = false;
        state.isPaymentTypesError = true;
        state.message = action.payload;
      })

      // Create payment type
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

      // Update payment type
      .addCase(updatePaymentType.pending, (state) => {
        state.isPaymentTypesLoading = true;
      })
      .addCase(updatePaymentType.fulfilled, (state, action) => {
        state.isPaymentTypesLoading = false;
        state.isPaymentTypesSuccess = true;

        state.paymentTypes = state.paymentTypes.map((payment) =>
          payment._id === action.payload._id
            ? {
                ...payment,
                type_name: action.payload.type_name,
                type_image: action.payload.type_image,
                typeImageFileId: action.payload.typeImageFileId,
              }
            : payment,
        );
      })
      .addCase(updatePaymentType.rejected, (state, action) => {
        state.isPaymentTypesLoading = false;
        state.isPaymentTypesError = true;
        state.message = action.payload;
      })

      // Delete payment type
      .addCase(deletePaymentType.pending, (state) => {
        state.isPaymentTypesLoading = true;
      })
      .addCase(deletePaymentType.fulfilled, (state, action) => {
        state.isPaymentTypesLoading = false;
        state.isPaymentTypesSuccess = true;

        state.paymentTypes = state.paymentTypes.filter(
          (payment) => payment._id !== action.payload._id,
        );
      })
      .addCase(deletePaymentType.rejected, (state, action) => {
        state.isPaymentTypesLoading = false;
        state.isPaymentTypesError = true;
        state.message = action.payload;
      });
  },
});

export const { resetPaymentType } = paymentTypeSlice.actions;
export default paymentTypeSlice.reducer;
