import {createSlice,createAsyncThunk, isRejectedWithValue} from "@reduxjs/toolkit";
import supplierService from "./supplierService";

const initialState = {
    suppliers: [],
    isSupplierLoading: false,
    isSupplierSuccess: false,
    isSupplierError: false,
    message: ''

}

export const setSupplier = createAsyncThunk('suppliersState/setSupppliers', async (supplierPayload, thunkAPI) => {
    try{ 
        const token = thunkAPI.getState().auth.user.token
        return await supplierService.setSupplier(supplierPayload, token)

    }catch (error){
        const message = (error.response && error.respose.data && error.response.data.message)
        || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

export const getSupplier = createAsyncThunk('supplierState/getSuppliers', async (_, thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.user.token
        return await supplierService.getSupplier(token)
    }catch (error){
        const message = (error.response && error.response.data && error.data.message)
        || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})


export const updateSupplier = createAsyncThunk('supplierState/updateSupplier', async (supplierPayload, thunkAPI) => {
    try{
        const {supplierID, updatedSupplierData} = supplierPayload
        const token = thunkAPI.getState().auth.user.token
        return await supplierService.updateSupplier(supplierID, updatedSupplierData, token)
    }catch(error){
        const message = (error.response && error.response.data && error.data.message)
        || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})


export const deleteSupplier = createAsyncThunk('supplierState/deleteSupplier', async (supplierID, thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.user.token
        return await supplierService.deleteSupplier(supplierID, token)

    }catch (error){
        const message = (error.response && error.response.data && error.response.data.message)
        || error.message || error.toString()

        thunkAPI.rejectWithValue(message)
    }
})

const supplierSlice = createSlice({
    name: 'supplierState',
    initialState,
    reducers:{
        resetSuppliers: () => initialState,
    },

    extraReducers: (builder) => {
        builder
            .addCase(setSupplier.pending, (state) => {
                state.isSupplierLoading = true
            })
            .addCase(setSupplier.fulfilled,(state, action) => {
                state.isSupplierLoading = false
                state.isSupplierSuccess = true
                state.suppliers = state.suppliers.concat(action.payload)
            }).addCase(setSupplier.rejected, (state, action) => {
                state.isSupplierLoading = false
                state.isSupplierError = true
                state.message = action.payload
            })
            .addCase(getSupplier.pending, (state) => {
                state.isSupplierLoading = true
            })
            .addCase(getSupplier.fulfilled, (state, action) => {
                state.isSupplierLoading = false
                state.isSupplierSuccess = true
                state.suppliers = action.payload
            })
            .addCase(getSupplier.rejected, (state, action) => {
                state.isSupplierLoading = false
                state.isSupplierError = true
                state.message = action.payload
            })
            .addCase(updateSupplier.pending, (state) => {
                state.isSupplierLoading = true
            })
            .addCase(updateSupplier.fulfilled, (state, action) => {
                state.isSupplierLoading = false
                state.isSupplierSuccess = true
                state.suppliers.map((person) => {
                    if(person._id === action.payload._id){
                        state.suppliers.supplierProducts =  action.payload.suppliers.supplierProducts
                        state.suppliers.supplierName = action.payload.suppliers.supplierName 
                        state.suppliers.supplierPhoneNumber =  action.payload.suppliers.supplierPhoneNumber  
                        state.suppliers.supplierAddress =  action.payload.suppliers.supplierAddress
                        state.suppliers.supplierEmail = action.payload.suppliers.supplierEmail 
                    }
                })
            })
            


    }
})

export const { resetSuppliers } = supplierSlice.actions
export default supplierSlice.reducer