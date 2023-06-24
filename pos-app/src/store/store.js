import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../auth/authSlice.js'
import userReducer from '../redux/users/userSlice.js'
import productReducer from '../redux/products/productSlice.js'
import searchReducer from '../redux/search/searchSlice.js'
import cartReducer from '../redux/sale/cartSlice.js'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        users: userReducer,
        products: productReducer,
        search: searchReducer,
        cart: cartReducer,
    },
})