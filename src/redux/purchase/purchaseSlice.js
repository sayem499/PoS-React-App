import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import purchasesService from "./purchaseService";

const initialState = {
  purchases: [],
  purchase: [],
  cartItems: [],
  purchaseSubTotal: 0,
  purchaseVAT: 0,
  purchaseDiscount: 0,
  purchaseTotal: 0,
  purchaseTotalCost: 0,
  purchasePayType: "",
  purchasePayByCard: 0,
  purchasePayByCash: 0,
  purchaseTime: 0,
  purchaseDate: 0,
  purchaseServedBy: "",
  purchaseLessAdjustment: 0,
  purchaseVATAmount: 0,
  purchaseDiscountAmount: 0,
  purchaseSupplierId: "",
  purchaseSupplierName: "",
  purchaseSupplierPhoneNumber: "",
  purchaseCashPaid: 0,
  purchaseChange: 0,
  totalPurchase: 0,
  averagePurchase: 0,
  purchaseTotalCost: 0,
  grossProfit: 0,
  grossMargin: 0,
  purchaseLessAdjustmentToggle: false,
  isPurchaseLoading: false,
  isPurchaseSuccess: false,
  isPurchaseError: false,
  message: "",
};

export const allPurchases = createAsyncThunk(
  "purchases/allPurchases",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await purchasesService.allPurchases(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const registerPurchase = createAsyncThunk(
  "purchases/setPurchases",
  async (purchases, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await purchasesService.setPurchases(purchases, token);
    } catch (error) {
      const message =
        error.response ||
        error.response.data ||
        error.response.data.message ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deletePurchase = createAsyncThunk(
  "purchases/deletePurchase",
  async (purchaseID, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await purchasesService.deletePurchase(purchaseID, token);
    } catch (error) {
      const message =
        error.response ||
        error.response.data ||
        error.response.data.message ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updatePurchases = createAsyncThunk(
  "purchases/updatePurchases",
  async (updatedPurchasesData, thunkAPI) => {
    try {
      const { purchaseID, updatedPurchaseData } = updatedPurchasesData;
      const token = thunkAPI.getState().auth.user.token;
      return await purchasesService.updatePurchases(
        purchaseID,
        updatedPurchaseData,
        token
      );
    } catch (error) {
      const message =
        error.response ||
        error.response.data ||
        error.response.data.message ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getPurchaseById = createAsyncThunk(
  "purchases/getPurchaseById",
  async (purchaseID, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await purchasesService.getPurchaseById(purchaseID, token);
    } catch (error) {
      const message =
        error.response ||
        error.response.data ||
        error.response.data.message ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const purchaseSlice = createSlice({
  name: "purchases",
  initialState,
  reducers: {
    resetPurchase: () => initialState,

    insertProductPurchase: (state, action) => {
      state.cartItems.push(action.payload);
    },

    incrementCartItem: (state, action) => {
      state.cartItems.map((count) => {
        if (count._id === action.payload) {
          count.productQuantity = count.productQuantity + 1;
        }
      });
    },

    decrementCartItem: (state, action) => {
      state.cartItems
        .filter((count) => count._id === action.payload)
        .map((count) => {
          if (count.productQuantity >= 2) {
            count.productQuantity = count.productQuantity - 1;
          } else {
            count.productQuantity = 1;
          }
        });
    },

    deleteCartItem: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (product) => product._id !== action.payload
      );
    },

    cartProductTotal: (state) => {
      state.cartItems.forEach((item) => {
        item.productTotalCost = item.productQuantity * item.productUnitCost;
      });
    },

    cartSubTotal: (state) => {
      state.purchaseSubTotal = 0;
      state.cartItems.forEach((item) => {
        state.purchaseSubTotal = state.purchaseSubTotal + item.productTotalCost;
      });
    },

    cartNetTotal: (state) => {
      state.purchaseTotal = 0;
      if (state.purchaseVAT > 0) {
        state.purchaseTotal =
          state.purchaseTotal + (state.purchaseVAT / 100) * state.purchaseSubTotal;
      }

      state.purchaseVATAmount = (state.purchaseVAT / 100) * state.purchaseSubTotal;

      if (state.purchaseDiscount > 0) {
        state.purchaseTotal =
          state.purchaseTotal - (state.purchaseDiscount / 100) * state.purchaseSubTotal;
      }

      state.purchaseDiscountAmount =
        (state.purchaseDiscount / 100) * state.purchaseSubTotal;
      state.purchaseTotal = state.purchaseTotal + state.purchaseSubTotal;
    },

    setPurchaseSettings: (state, action) => {
      localStorage.setItem("purchase-settings", JSON.stringify(action.payload));
    },

    getPurchaseSettings: (state) => {
      let payload = JSON.parse(localStorage.getItem("purchase-settings"));
      state.purchaseVAT = payload?.purchaseVAT || 0;
      state.purchaseDiscount = payload?.purchaseDiscount || 0;
      state.purchaseLessAdjustmentToggle = payload?.purchaseLessAdjustmentToggle || 0;
    },

    cartTotalLessAdjustment: (state) => {
      let temp = 0;
      state.purchaseLessAdjustment = 0;
      if (state.purchaseLessAdjustmentToggle && state.purchaseTotal) {
        temp = Math.floor(state.purchaseTotal);
        state.purchaseLessAdjustment = state.purchaseTotal - temp;
        state.purchaseTotal = temp;
      }
    },

    insertPurchasePayType: (state, action) => {
      state.purchasePayType = action.payload;
      if (state.purchasePayType === "Credit") {
        state.purchasePayByCard = state.purchaseTotal;
        state.purchasePayByCash = 0;
      } else if (state.purchasePayType === "Cash") {
        state.purchasePayByCash = state.purchaseTotal;
        state.purchasePayByCard = 0;
      }
    },

    insertPurchasePerson: (state, action) => {
      state.purchaseServedBy = action.payload;
    },

    insertTimeDate: (state, action) => {
      state.purchaseDate = action.payload.purchaseDate;
      state.purchaseTime = action.payload.purchaseTime;
    },

    cartTotalCost: (state) => {
      state.purchaseTotalCost = 0;
      state.cartItems.map((item) => {
        state.purchaseTotalCost =
          state.purchaseTotalCost + item.productQuantity * item.productUnitCost;
      });
    },

    calculateTotalPurchase: (state) => {
      state.totalPurchase = 0;
      if (state.purchases.length !== 0) {
        state.purchases.map((purchase) => {
          state.totalPurchase = state.totalPurchase + purchase.purchaseTotal;
        });
      }
    },

    calculateAverageSale: (state) => {
      state.averageSale = 0;
      if (state.sales.length !== 0) {
        state.averageSale = state.totalSale / state.sales.length;
      }
    },

    calculateGrossProfit: (state) => {
      state.grossProfit = 0;
      state.sales.map((item) => {
        state.grossProfit =
          state.grossProfit + (item.saleTotal - item.saleTotalCost);
      });
    },

    calculateGrossMargin: (state) => {
      state.grossMargin = 0;

      state.grossMargin = (state.grossProfit / state.totalSale) * 100;
    },

    insertSupplierId:(state, action) => {
      state.purchaseSupplierId = action.payload;
    },

    insertSupplierName: (state, action) => {
      state.purchaseSupplierName = action.payload.supplierName;
    },

    insertSupplierPhoneNumber: (state, action) => {
      state.purchaseSupplierPhoneNumber = action.payload.supplierPhoneNumber;
    },

    insertCashPaid: (state, action) => {
      state.purchaseCashPaid = action.payload;
    },

    calculateChange: (state) => {
      if (
        state.purchaseCashPaid === 0 ||
        state.purchaseCashPaid === "" ||
        state.purchaseCashPaid < state.purchaseTotal ||
        state.cartItems.length === 0
      ) {
        state.purchaseChange = 0;
      } else {
        state.purchaseChange = state.purchaseCashPaid - state.purchaseTotal;
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(allPurchases.pending, (state) => {
        state.isPurchaseLoading = true;
      })
      .addCase(allPurchases.fulfilled, (state, action) => {
        state.isPurchaseLoading = false;
        state.isPurchaseSuccess = true;
        state.purchases = action.payload;
      })
      .addCase(allPurchases.rejected, (state, action) => {
        state.isPurchaseLoading = false;
        state.isPurchaseError = true;
        state.message = action.payload;
      })
      .addCase(registerPurchase.pending, (state) => {
        state.isPurchaseLoading = true;
      })
      .addCase(registerPurchase.fulfilled, (state, action) => {
        state.isPurchaseLoading = false;
        state.isPurchaseSuccess = true;
        state.purchases = state.purchases.concat(action.payload);
      })
      .addCase(registerPurchase.rejected, (state, action) => {
        state.isPurchaseLoading = false;
        state.isPurchaseError = true;
        state.message = action.payload;
      })
      .addCase(deletePurchase.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePurchase.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.purchases = state.purchases.filter(
          (purchase) => purchase._id !== action.payload.id
        );
      })
      .addCase(deletePurchase.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updatePurchases.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePurchases.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.purchases.map((purchase) => {
          if (purchase._id === action.payload._id) {
            purchase.purchaseProducts = action.payload.purchaseProducts;
            purchase.productSupplierId = action.payload.productSupplierId;
            // purchase.productQuantity = action.payload.productQuantity
            // purchase.productQuantitySold = action.payload.productQuantitySold
            // purchase.productUnitCost = action.payload.productUnitCost
            // purchase.productTotalCost = action.payload.productTotalCost
            purchase.purchaseVat = action.payload.purchaseVat;
            purchase.purchaseVatAmount = action.payload.purchaseVatAmount;
            purchase.purchaseDiscount = action.payload.purchaseDiscount;
          }
        });
      })
      .addCase(updatePurchases.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getPurchaseById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPurchaseById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.purchase = action.payload;
      })
      .addCase(getPurchaseById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { 
    resetPurchase,
    insertProductPurchase, 
    incrementCartItem, 
    decrementCartItem, 
    deleteCartItem, 
    cartProductTotal, 
    cartSubTotal, 
    cartNetTotal,
    setPurchaseSettings,
    getPurchaseSettings,
    cartTotalLessAdjustment,
    insertPurchasePayType,
    insertPurchasePerson,
    insertTimeDate,
    calculateTotalPurchase,
    calculateAveragePurchase,
    cartTotalCost,
    calculateGrossProfit,
    calculateGrossMargin,
    insertSupplierId,
    insertSupplierName,
    insertSupplierPhoneNumber,
    insertCashPaid,
    calculateChange, 

} = purchaseSlice.actions;
export default purchaseSlice.reducer;
