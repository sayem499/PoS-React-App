import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    searchInput: '',
    searchRef: '',
}

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        reset: () => initialState, 

        search: (state, action) => {
            state.searchInput = action.payload
        },

        setSearchRef: (state, action) => {
            state.searchRef = action.payload
        },

    },
})

export const {reset, search, setSearchRef} = searchSlice.actions
export default searchSlice.reducer