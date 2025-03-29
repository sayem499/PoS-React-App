import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; 
import productService from "./productService";


const initialState = {
    products: [],
    product: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
    page: '',
    limit: '',
    total: '',
    totalPages: '',
    hasMore: false,

}

export const allProducts = createAsyncThunk('products/allProducts', async (pageObj, thunkAPI) => {
    try {
        const page = pageObj ? pageObj.page : undefined;  // Check if pageObj is defined
        const token = thunkAPI.getState().auth.user.token 
        const response = await productService.allProducts(page, token)
        const existingProducts = thunkAPI.getState().products.products || [];
        return {
            products: page === 1 ? response.products : [...existingProducts, ...response.products],
            hasMore: response.page < response.totalPages,  // Check if more pages exist
            page: response.page,
            limit: response.limit,
            total: response.total,
            totalPages: response.totalPages
        };
    } catch (error){
        const message = (error.response && error.response.data && error.response.data.message)
        || error.message || error.toString()
        if(message === 'Invalid token'){
            localStorage.removeItem('users');
        }
        return thunkAPI.rejectWithValue(message)
    }
} )

export const loadMoreProducts = createAsyncThunk('products/loadMoreProducts', async (pageObj, thunkAPI) => {
    try {
        const { page } = pageObj
        const token = thunkAPI.getState().auth.user.token 
        const response = await productService.allProducts(page, token)
        const existingProducts = thunkAPI.getState().products.products || [];

        return {
            products: page === 1 ? response.products : [...existingProducts, ...response.products],
            hasMore: response.page < response.totalPages,  // Check if more pages exist
            page: response.page,
            limit: response.limit,
            total: response.total,
            totalPages: response.totalPages
        };

    } catch (error){
        const message = (error.response && error.response.data && error.response.data.message)
        || error.message || error.toString()
        if(message === 'Invalid token'){
            localStorage.removeItem('users');
        }
        return thunkAPI.rejectWithValue(message)
    }
} )

export const getProductById = createAsyncThunk('products/getProductById', async (productID, thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.user.token
        return await productService.getProductById(productID, token)
    } catch (error){
        const message = (error.response || error.response.data || error.response.data.message)
        || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

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
                state.isSuccess = false
            })
            .addCase(allProducts.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.products = state.products.length > 80 ? [...action.payload.products] : [...state.products, ...action.payload.products];
                state.page = action.payload.page
                state.limit = action.payload.limit
                state.total = action.payload.total
                state.totalPages = action.payload.totalPages
            })
            .addCase(allProducts.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(loadMoreProducts.pending, (state) => {
                state.isLoading = true
                state.isSuccess = false
            })
            .addCase(loadMoreProducts.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.products = state.products.length > 80 ? [...action.payload.products] : [...state.products, ...action.payload.products];
                state.hasMore = action.payload.page < action.payload.totalPages || action.payload.totalPages === 1;
                state.page = action.payload.page
                state.limit = action.payload.limit
                state.total = action.payload.total
                state.totalPages = action.payload.totalPages
            })
            .addCase(getProductById.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getProductById.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.product = action.payload
            })
            .addCase(getProductById.rejected, (state, action) => {
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
                state.products = state.products.concat(action.payload)
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
                state.products.map((product) => {
                    if( product._id === action.payload._id){
                        product.productTitle = action.payload.productTitle
                        product.productBrand = action.payload.productBrand
                        product.productQuantity = action.payload.productQuantity
                        product.productType = action.payload.productType
                        product.productUnitPrice = action.payload.productUnitPrice
                        product.productCurrentPurchaseId = action.payload.productCurrentPurchaseId
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