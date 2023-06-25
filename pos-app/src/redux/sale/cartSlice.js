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

        allCartProduct: (state, action) => {
            state.cartProduct = action.payload
        },

        insertProduct: (state, action) => {
            state.cartProduct = state.cartProduct.concat(action.payload)
        }, 

        deleteProduct: (state, action) => {
            if(state.cartProduct.length > 1)
                state.cartProduct = state.cartProduct.filter((product) => product._id !== action.payload)
            else
                state.cartProduct = []      
          
        },
    },

})

export const { reset, insertProduct, deleteProduct, allCartProduct } = cartSlice.actions
export default cartSlice.reducer 