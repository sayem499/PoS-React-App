import {createSlice} from "@reduxjs/toolkit"
import searchSlice from "../search/searchSlice"

const initialState = {
    cartProduct: [],
}

const cartSlice = createSlice({
    name:'cart',
    initialState,
    reducers: {
        resetCart: () => initialState,

        insertProduct: (state, action) => {
            state.cartProduct = state.cartProduct.concat(action.payload)
        }, 

        deleteProduct: (state, action) => {
            state.cartProduct = state.cartProduct.filter((product) => product._id !== action.payload.id)
        }
    },

})

export const { reset, insertProduct, deleteProduct } = cartSlice.actions
export default cartSlice.reducer 