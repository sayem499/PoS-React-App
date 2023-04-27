import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";

const initialState = {
    users:  [],
    isError:  false,
    isLoading:  false,
    isSuccess:  false,
    message:  '',
}

//Get All Users
export const allUsers = createAsyncThunk('users/allUsers', async (_,thunkAPI) => {
    try{
        return await userService.allUsers()
    }catch (error){
        const message = (error.response && error.response.data && error.response.data.message)
        || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

export const userSlice = createSlice ({
    name: 'users',
    initialState,
    reducers: {
        reset: (state) => initialState
    },

    extraReducers: (builder) => {
        builder
            .addCase(allUsers.pending, (state) => {
                state.isLoading = true
            })
            .addCase(allUsers.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.users = action.payload
            })
            .addCase(allUsers.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    },


})



export const { reset } = userSlice.actions
export default userSlice.reducer