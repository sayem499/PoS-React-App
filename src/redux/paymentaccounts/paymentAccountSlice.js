import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import paymentAccountService from "./paymentAccountService";

const initialState = {
  paymentAccounts: [],
  isPaymentAccountsLoading: false,
  isPaymentAccountsSuccess: false,
  isPaymentAccountsError: false,
  message: "",
};

export const allPaymentAccounts = createAsyncThunk(
  "paymentAccountsState/allPaymentAccounts",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await paymentAccountService.getPaymentTypes(token);
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

export const setPaymentAccount = createAsyncThunk(
  "paymentAccountsState/setPaymentAccount",
  async (paymentAccount, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await paymentAccountService.setPaymentAccount(paymentAccount, token);
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

export const updatePaymentAccount = createAsyncThunk(
  "paymentAccountsState/updatePaymentAccount",
  async (payload, thunkAPI) => {
    try {
      const { paymentAccountID, updatedPaymentAccountData } = payload;
      const token = thunkAPI.getState().auth.user.token;
      return await paymentAccountService.updatePaymentAccount(
        paymentAccountID,
        updatedPaymentAccountData,
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

export const deletePaymentAccount = createAsyncThunk(
  "paymentAccountsState/deletePaymentAccount",
  async (paymentAccountID, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await paymentAccountService.deletePaymentAccount(paymentAccountID, token);
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

export const paymentAccountSlice = createSlice({
  name: "paymentAccountState",
  initialState,
  reducers: {
    resetPaymentAccount: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(allPaymentAccounts.pending, (state) => {
        state.isPaymentAccountsLoading = true
      })
      .addCase(allPaymentAccounts.fulfilled, (state, action) => {
        state.isPaymentAccountsLoading = false
        state.isPaymentAccountsSuccess = true
        state.paymentAccounts = action.payload
      })
      .addCase(allPaymentAccounts.rejected, (state, action) => {
        state.isPaymentAccountsLoading = false
        state.isPaymentAccountsError = true
        state.message = action.payload
      })
      .addCase(setPaymentAccount.pending, (state) => {
        state.isPaymentAccountsLoading = true
      })
      .addCase(setPaymentAccount.fulfilled, (state, action) => {
        state.isPaymentAccountsLoading = false
        state.isPaymentAccountsSuccess = true
        state.paymentAccounts = state.paymentAccounts.concat(action.payload);
      })
      .addCase(setPaymentAccount.rejected, (state, action) => {
        state.isPaymentAccountsLoading = false
        state.isPaymentAccountsError = true
        state.message = action.payload
      })
      .addCase(updatePaymentAccount.pending, (state) => {
        state.isPaymentAccountsLoading = true
      })
      .addCase(updatePaymentAccount.fulfilled, (state, action) => {
        state.isPaymentAccountsLoading = false
        state.isPaymentAccountsSuccess = true
        state.paymentAccounts.map((payment) => {
          if (payment._id === action.payload._id) {
            payment.account_name = action.payload.account_name
            payment.account_number = action.payload.account_number
            payment.branch_name = action.payload.branch_name
          }
        });
      })
      .addCase(updatePaymentAccount.rejected, (state, action) => {
        state.isPaymentAccountsLoading = false
        state.isPaymentAccountsError = true
        state.message = action.payload
      })
      .addCase(deletePaymentAccount.pending, (state) => {
        state.isPaymentAccountsLoading = true
      })
      .addCase(deletePaymentAccount.fulfilled, (state, action) => {
        state.isPaymentAccountsLoading = false
        state.isPaymentAccountsSuccess = true
        state.paymentAccounts = state.paymentAccounts.filter(
          (payment) => payment._id !== action.payload._id
        );
      })
      .addCase(deletePaymentAccount.rejected, (state, action) => {
        state.isPaymentAccountsLoading = false
        state.isPaymentAccountsError = true
        state.message = action.payload
      })
  }
});

export const { resetPaymentAccount } = paymentAccountSlice.actions;
export default paymentAccountSlice.reducer;