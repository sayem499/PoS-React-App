import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    searchInput: '',
}

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        reset: () => initialState, 

        search: (state, action) => {
            state.searchInput = action.payload
        },

    },
})

export const {reset, search } = searchSlice.actions
export default searchSlice.reducer