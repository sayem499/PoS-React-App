import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../auth/authSlice.js'
import userReducer from '../redux/users/userSlice.js'
import productReducer from '../redux/products/productSlice.js'
import searchReducer from '../redux/search/searchSlice.js'
import saleReducer from '../redux/sale/saleSlice.js'
import customerReducer from '../redux/customer/customerSlice.js'
import supplierReducer from '../redux/supplier/supplierSlice.js'
import purchaseReducer from '../redux/purchase/purchaseSlice.js'
import paymentTypeReducer from '../redux/payment/paymentSlice.js'
import paymentAccountReducer from '../redux/paymentaccounts/paymentAccountSlice.js'

import uploadReducer from '../redux/upload/uploadSlice.js'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        users: userReducer,
        products: productReducer,
        purchase: purchaseReducer,
        customerState: customerReducer,
        supplierState: supplierReducer,
        search: searchReducer,
        sale: saleReducer,
        paymentTypeState: paymentTypeReducer,
        paymentAccountState: paymentAccountReducer,
        upload: uploadReducer

    },
})