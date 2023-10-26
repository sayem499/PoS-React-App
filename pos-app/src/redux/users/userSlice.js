import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";

const initialState = {
    users: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: '',
}

//Get All Users
export const allUsers = createAsyncThunk('users/allUsers', async (_, thunkAPI) => {
    try {
        return await userService.allUsers()
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

export const updateUser = createAsyncThunk('users/updateUser', async (payload, thunkAPI) => {
    try {
        const { userID, updatedUserData } = payload
        const token = thunkAPI.getState().auth.user.token
        return await userService.updateUser(userID, updatedUserData, token)
    } catch (error) {
        const message = (error.response || error.response.data || error.response.data.message)
        || error.message || error.toString()
    }
})

export const deleteUser = createAsyncThunk('users/deleteUser', async (userID, thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.user.token
        return await userService.deleteCustomer(userID, token)

    }catch(error){
        const message = (error.response && error.response.data && error.response.data.message)
        || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    } 
})

export const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        reset: () => initialState
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
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.users.map((user) => {
                    if(user._id === action.payload._id){
                        user.userName = action.payload.userName
                        user.userType = action.payload.userType
                        user.userPassword = action.payload.userPassword
                    }
                }) 
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(deleteUser.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.users = state.users.filter((person) => person._id !== action.payload._id)
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    },


})



export const { reset } = userSlice.actions
export default userSlice.reducer