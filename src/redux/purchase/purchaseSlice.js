import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; 
import purchasesService from "./purchaseService";


const initialState = {
    purchases: [],
    purcahse: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',

}

export const allPurchases = createAsyncThunk('purchases/allPurchases', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token 
        return await purchasesService.allPurchases(token)
        
    } catch (error){
        const message = (error.response && error.response.data && error.response.data.message)
        || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
} )


export const setPurchases = createAsyncThunk('purchases/setPurchases', async (purchases, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await purchasesService.setPurchases(purchases, token)
    } catch (error){
        const message = (error.response || error.response.data || error.response.data.message)
        || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
} )

export const deletePurchase = createAsyncThunk ('purchases/deletePurchase', async (purchaseID, thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.user.token
        return await purchasesService.deletePurchase(purchaseID, token)

    } catch (error){
        const message = (error.response || error.response.data || error.response.data.message)
        || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

export const updatePurchases = createAsyncThunk('purchases/updatePurchases', async (updatedPurchasesData, thunkAPI) => {
    try {
        const { purchaseID, updatedPurchaseData} = updatedPurchasesData
        const token = thunkAPI.getState().auth.user.token
        return await purchasesService.updatePurchases( purchaseID, updatedPurchaseData, token)
    } catch (error){
        const message = (error.response || error.response.data || error.response.data.message)
        || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
} )


export const getPurchaseById = createAsyncThunk('purchases/getPurchaseById', async (purchaseID, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await purchasesService.getPurchaseById( purchaseID, token);
    } catch (error){
        const message = (error.response || error.response.data || error.response.data.message)
        || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})


export const purchaseSlice = createSlice({

    name: 'purchases',
    initialState,
    reducers: {
        reset: () => initialState,
    },

    extraReducers: (builder) => {
        builder
            .addCase(allPurchases.pending, (state) => {
                state.isLoading = true
            })
            .addCase(allPurchases.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.purchases = action.payload
            })
            .addCase(allPurchases.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(setPurchases.pending, (state) => {
                state.isLoading = true
            })
            .addCase(setPurchases.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.purchases = state.purchases.concat(action.payload)
            })
            .addCase(setPurchases.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(deletePurchase.pending, (state) => {
                state.isLoading = true
            })
            .addCase(deletePurchase.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.purchases = state.purchases.filter( (purchase) => purchase._id !== action.payload.id)
            })
            .addCase(deletePurchase.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(updatePurchases.pending, (state) => {
                state.isLoading = true
            })
            .addCase(updatePurchases.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.purchases.map((purchase) => {
                    if( purchase._id === action.payload._id){
                        purchase.purchaseProducts = action.payload.purchaseProducts
                        purchase.productSupplierId = action.payload.productSupplierId
                        // purchase.productQuantity = action.payload.productQuantity
                        // purchase.productQuantitySold = action.payload.productQuantitySold
                        // purchase.productUnitCost = action.payload.productUnitCost
                        // purchase.productTotalCost = action.payload.productTotalCost
                        purchase.purchaseVat = action.payload.purchaseVat
                        purchase.purchaseVatAmount = action.payload.purchaseVatAmount
                        purchase.purchaseDiscount = action.payload.purchaseDiscount
                    }
                })
            })
            .addCase(updatePurchases.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    },

})

export const { reset } = purchaseSlice.actions
export default purchaseSlice.reducer