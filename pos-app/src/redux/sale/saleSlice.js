import{ createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import saleServices from './saleService'


const initialState = {
    sales: [],
    cartItems: [],
    saleSubTotal: 0,
    saleVAT: 0,
    saleDiscount: 0,
    saleTotal: 0,
    saleTotalCost: 0,
    salePayType: '',
    salePayByCard: 0,
    salePayByCash: 0,
    saleTime: 0,
    saleDate: 0,
    saleServedBy: '',
    saleLessAdjustment: 0,
    saleVATAmount: 0,
    saleDiscountAmount: 0,
    saleLessAdjustmentToggle: false, 
    isSaleLoading: false,
    isSaleError: false,
    isSaleSuccess: false,
    isFetchSaleLoading: false,
    isFetchSaleError: false,
    isFetchSaleSuccess: false,
    message: '',
}




export const registerSale = createAsyncThunk('sale/registerSale', async (salePayload, thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.user.token
        return await saleServices.registerSale(salePayload, token)

    }catch( error ) {
        const message = (error.response && error.response.data && error.response.data.message) 
        || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

export const getSales = createAsyncThunk('sale/getSales', async (_, thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.user.token
        return await saleServices.getSales(token)
    } catch (error) {
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
                state.saleTotal = state.saleTotal + ((state.saleVAT/100) * state.saleSubTotal)
            }

            state.saleVATAmount = ((state.saleVAT/100) * state.saleSubTotal)

            if(state.saleDiscount > 0){
                state.saleTotal = state.saleTotal - ((state.saleDiscount/100) * state.saleSubTotal)
            }

            state.saleDiscountAmount = ((state.saleDiscount/100) * state.saleSubTotal)
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
               state.saleLessAdjustment = (state.saleTotal - temp) 
               state.saleTotal = temp
            }   
        },

        insertSalePayType: (state,action) => {
            state.salePayType = action.payload
            if(state.salePayType === 'Credit'){
                state.salePayByCard = state.saleTotal
                state.salePayByCash = 0
            }else if(state.salePayType === 'Cash'){
                state.salePayByCash = state.saleTotal
                state.salePayByCard = 0
            }
        },

        insertSalePerson: (state, action) => {
            state.saleServedBy = action.payload
        },

        insertTimeDate: (state, action) => {
            state.saleDate = action.payload.saleDate
            state.saleTime = action.payload.saleTime
        }
        


    },

    extraReducers: (builder) => {
        builder
        .addCase(registerSale.pending, (state) => {
            state.isSaleLoading = true
        })
        .addCase(registerSale.fulfilled, (state, action) => {
            state.isSaleLoading = false
            state.isSaleSuccess = true
            console.log(action.payload)
        })
        .addCase(registerSale.rejected, (state, action) => {
            state.isSaleLoading = false
            state.isSaleError = true
            state.message = action.payload
        })
        .addCase(getSales.pending, (state) => {
            state.isFetchSaleLoading = true
        })
        .addCase(getSales.fulfilled, (state, action) => {
            state.isFetchSaleLoading = false
            state.isFetchSaleSuccess = true
            state.sales = action.payload
        })
        .addCase(getSales.rejected, (state, action) => {
            state.isFetchSaleLoading = false
            state.isFetchSaleError = true
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
    insertSalePayType,
    insertSalePerson,
    insertTimeDate,
} = saleSlice.actions
export default saleSlice.reducer