import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../auth/authSlice.js'
import userReducer from '../redux/users/userSlice.js'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        users: userReducer,
    },
})