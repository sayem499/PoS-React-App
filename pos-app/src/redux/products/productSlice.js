import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; 
import productService from "./productService";


const initialState = {
    products: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',

}

export const allProducts = createAsyncThunk('products/allProducts', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token 
        return await productService.allProducts(token)
        
    } catch (error){
        const message = (error.response && error.response.data && error.response.data.message)
        || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
} )


export const setProducts = createAsyncThunk('products/setProducts', async (products, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await productService.setProducts(products, token)
    } catch (error){
        const message = (error.response || error.response.data || error.response.data.message)
        || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
} )

export const deleteProduct = createAsyncThunk ('products/deleteProduct', async (productID, thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.user.token
        return await productService.deleteProduct(productID, token)

    } catch (error){
        const message = (error.response || error.response.data || error.response.data.message)
        || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

export const updateProducts = createAsyncThunk('products/updateProducts', async (updatedProductsData, thunkAPI) => {
    try {
        const { productID, updatedProductData} = updatedProductsData
        const token = thunkAPI.getState().auth.user.token
        return await productService.updateProducts( productID, updatedProductData, token)
    } catch (error){
        const message = (error.response || error.response.data || error.response.data.message)
        || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
} )


export const productSlice = createSlice({

    name: 'products',
    initialState,
    reducers: {
        reset: () => initialState,
    },

    extraReducers: (builder) => {
        builder
            .addCase(allProducts.pending, (state) => {
                state.isLoading = true
            })
            .addCase(allProducts.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.products = action.payload
            })
            .addCase(allProducts.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(setProducts.pending, (state) => {
                state.isLoading = true
            })
            .addCase(setProducts.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.products.push(action.payload)
            })
            .addCase(setProducts.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(deleteProduct.pending, (state) => {
                state.isLoading = true
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.products = state.products.filter( (product) => product._id !== action.payload.id)
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(updateProducts.pending, (state) => {
                state.isLoading = true
            })
            .addCase(updateProducts.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.products = state.products.map((product) => {
                    if( product._id === action.payload._id){
                        product.productTitle = action.payload.productTitle
                        product.productBrand = action.payload.productBrand
                        product.productQuantity = action.payload.productQuantity
                        product.productType = action.payload.productType
                        product.productUnitPrice = action.payload.productUnitPrice
                    }
                })
            })
            .addCase(updateProducts.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    },

})

export const { reset } = productSlice.actions
export default productSlice.reducer