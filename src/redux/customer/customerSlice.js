import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customerService from "./custmerService";





const initialState = {
    customers: [],
    isCustomerLoading: false,
    isCustomerSuccess: false,
    isCustomerError: false,
    message: '',
}

export const getCustomers = createAsyncThunk('customerState/getCustomers', async(_,thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.user.token
        return await customerService.getCustomers(token)
    }catch (error){
        const message = (error.response && error.response.data && error.response.data.message)
        || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

export const setCustomers = createAsyncThunk('customerState/setCustomers', async(customers , thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.user.token
        return await customerService.setCustomers(customers, token)

    } catch (error){
        const message = (error.response && error.response.data && error.response.data.message)
        || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

export const updateCustomer = createAsyncThunk('customerState/updateCustomer',async (payload, thunkAPI) => {
   try{
     const {customerID, updatedCustomerData} = payload
     const token = thunkAPI.getState().auth.user.token
     return await customerService.updateCustomer(customerID, updatedCustomerData, token)
   }catch(error){
    const message = (error.response || error.response.data || error.response.data.message)
    || error.message || error.toString()

    return thunkAPI.rejectWithValue(message)
   }
})

export const deleteCustomer = createAsyncThunk('customerState/deleteCustomer', async (customerID, thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.user.token
        return await customerService.deleteCustomer(customerID, token)

    }catch(error){
        const message = (error.response && error.response.data && error.response.data.message)
        || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    } 
})

export const customerSlice = createSlice({
    name: 'customerState',
    initialState,
    reducers: {
        resetCustomers: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCustomers.pending, (state) => {
                state.isCustomerLoading = true
            }) 
            .addCase(getCustomers.fulfilled, (state, action) => {
                state.isCustomerLoading = false
                state.isCustomerSuccess = true
                state.customers = action.payload
            })
            .addCase(getCustomers.rejected, (state, action) => {
                state.isCustomerLoading = false
                state.isCustomerError = true
                state.message = action.payload
            })
            .addCase(setCustomers.pending, (state) => {
                state.isCustomerLoading = true
            })
            .addCase(setCustomers.fulfilled, (state, action) => {
                state.isCustomerLoading = false
                state.isCustomerSuccess = true
                state.customers = state.customers.concat(action.payload)
            })
            .addCase(setCustomers.rejected, (state, action) => {
                state.isCustomerLoading = false
                state.isCustomerError = true
                state.message = action.payload
            })
            .addCase(updateCustomer.pending, (state) => {
                state.isCustomerLoading = true
            })
            .addCase(updateCustomer.fulfilled, (state, action) => {
                state.isCustomerLoading = false
                state.isCustomerSuccess = true
                state.customers.map((person) => {
                    if(person._id === action.payload._id){
                        person.customerName = action.payload.customerName
                        person.customerPhoneNumber = action.payload.customerPhoneNumber
                        person.customerTotalExpenditure = action.payload.customerTotalExpenditure
                        person.customerTotalTrades = action.payload.customerTotalTrades
                    }
                    
                })

            })
            .addCase(updateCustomer.rejected, (state, action) => {
                state.isCustomerLoading = false
                state.isCustomerError = true
                state.message = action.payload
            })
            .addCase(deleteCustomer.pending, (state) => {
                state.isCustomerLoading = true
            })
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                state.isCustomerLoading = false
                state.isCustomerSuccess = true
                state.customers = state.customers.filter((person) => person._id !== action.payload._id)
            })
            .addCase(deleteCustomer.rejected, (state, action) => {
                state.isCustomerLoading = false
                state.isCustomerError = true
                state.message = action.payload
            })

    }
})

export const { resetCustomers } = customerSlice.actions
export default customerSlice.reducer