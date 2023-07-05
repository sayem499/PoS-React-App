import{ createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import saleServices from './saleService'


const initialState = {
    cartItems: [],
    saleSubTotal: 0,
    saleVAT: 0,
    saleDiscount: 0,
    saleTotal: 0,
    salePayType: 0,
    salePayByCard: 0,
    salePayByCash: 0,
    saleTime: 0,
    saleDate: 0,
    saleServedBy: '',
    saleLessAdjustment: 0,
    saleLessAdjustmentToggle: false, 
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
}



export const registerSale = createAsyncThunk('sale/registerSale', async (cartItems, thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.user.token
        return await saleServices.registerSale(cartItems, token)

    }catch( error ) {
        const message = (error.response && error.response.data && error.response.data.message) 
        || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

export const saleSlice = createSlice({
    name: 'sale',
    initialState,
    reducers: {
        resetSale: () => initialState,

        insertProductSale: (state, action) => {
            state.cartItems.push(action.payload)
        },

        incrementCartItem: (state, action) => {
            state.cartItems.map((count) => {
                if(count._id === action.payload){
                    count.productQuantity = count.productQuantity + 1
                }
            })
        },

        decrementCartItem: (state, action)  => {
            state.cartItems.filter((count) => count._id === action.payload).map((count) => {
                if( count.productQuantity >= 2){
                    count.productQuantity = count.productQuantity - 1
                }else {
                    count.productQuantity = 1
                }
            })
        },

        deleteCartItem: (state, action) => {
            state.cartItems = state.cartItems.filter( (product) => product._id !== action.payload )
        },

        cartProductTotal: (state) => {
            state.cartItems.forEach((item) => {
                item.productTotal = item.productQuantity * item.productUnitPrice
            })
        },

        cartSubTotal: (state) => {
            state.saleSubTotal = 0
            state.cartItems.forEach((item) => {
                state.saleSubTotal = state.saleSubTotal + item.productTotal
            })
        },

        cartNetTotal: (state) => {
            state.saleTotal = 0
            if(state.saleVAT > 0){
                state.saleTotal = state.saleTotal - ((state.saleVAT/100) * state.saleSubTotal)
            }

            if(state.saleDiscount > 0){
                state.saleTotal = state.saleTotal + ((state.saleDiscount/100) * state.saleSubTotal)
            }

            state.saleTotal = state.saleTotal + state.saleSubTotal

        },

        setSaleSettings: (state, action) => {
            localStorage.setItem( 'sale-settings', JSON.stringify(action.payload))
            
        },

        getSaleSettings: (state) => {
           let payload = JSON.parse(localStorage.getItem('sale-settings'))
           state.saleVAT = payload.saleVAT
           state.saleDiscount = payload.saleDiscount
           state.saleLessAdjustmentToggle = payload.saleLessAdjustmentToggle
        },

        cartTotalLessAdjustment: (state) => {
            let temp = 0 
            state.saleLessAdjustment = 0
            if(state.saleLessAdjustmentToggle && state.saleTotal){
               temp = Math.floor(state.saleTotal)
               state.saleLessAdjustment = state.saleTotal - temp 
               state.saleTotal = temp
            }   
        }
        


    },

    extraReducers: (builder) => {
        builder
        .addCase(registerSale.pending, (state) => {
            state.isLoading = true
        })
        .addCase(registerSale.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.push(action.payload)
        })
        .addCase(registerSale.rejected, (state, action) => {
            state.isLoading = true
            state.isError = true
            state.message = action.payload
        })
   }, 
})

export const { 
    resetSale, 
    insertProductSale, 
    incrementCartItem, 
    decrementCartItem, 
    deleteCartItem, 
    cartProductTotal, 
    cartSubTotal, 
    cartNetTotal,
    setSaleSettings,
    getSaleSettings,
    cartTotalLessAdjustment,
} = saleSlice.actions
export default saleSlice.reducer