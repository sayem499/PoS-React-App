import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../auth/authSlice.js'
import userReducer from '../redux/users/userSlice.js'
import productReducer from '../redux/products/productSlice.js'
import searchReducer from '../redux/search/searchSlice.js'
import saleReducer from '../redux/sale/saleSlice.js'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        users: userReducer,
        products: productReducer,
        search: searchReducer,
        sale: saleReducer,
    },
})