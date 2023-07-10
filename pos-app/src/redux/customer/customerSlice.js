import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customerService from "./custmerService";





const initialState = {
    customers: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
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

export const customerSlice = createSlice({
    name: 'customerState',
    initialState,
    reducers: {
        resetCustomers: () => initialState
    },
})

export const { resetCustomers } = customerSlice.actions
export default customerSlice.reducer