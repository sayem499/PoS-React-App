import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; 
import uploadService from "./uploadService";


const initialState = {
    imageUrl: "",
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
}

export const imageUpload = createAsyncThunk('uploads/imageUpload', async ( {file, data, type}, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token 
        return await uploadService.imageUpload( type, file, data, token)
        
    } catch (error){
        const message = (error.response && error.response.data && error.response.data.message)
        || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})


export const uploadSlice = createSlice({

    name: 'upload',
    initialState,
    reducers: {
        reset: () => initialState,
    },

    extraReducers: (builder) => {
        builder
            .addCase(imageUpload.pending, (state) => {
                state.isLoading = true
            })
            .addCase(imageUpload.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.imageUrl = action.payload
            })
            .addCase(imageUpload.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })            
    },

})        

export const { reset } = uploadSlice.actions
export default uploadSlice.reducer