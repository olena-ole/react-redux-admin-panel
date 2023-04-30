import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

const initialState = {
    filtersLoadingStatus: 'idle',
    filters: [],
    filter: 'all'
}

export const fetchFilters = createAsyncThunk(
    'filters/fetchFilters',
    () => {
        const { request } = useHttp();
        return request("http://localhost:3001/filters")
    }
)

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
    // !!! in {}, we dont't return it, we mutate it using immer library (makes the initial state stay immutable)
        // filtersFetching: state => {state.filtersLoadingStatus = 'loading'},
        // filtersFetched: (state, action) => {
        //     state.filters = action.payload;
        //     state.filtersLoadingStatus = 'idle';
        // },
        // filtersFetchingError: state => {state.filtersLoadingStatus = 'error'},
        filterChanged: (state, action) => {state.filter = action.payload}
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFilters.pending, state => {state.filtersLoadingStatus = 'loading'})
            .addCase(fetchFilters.fulfilled, (state, action) => {
                state.filters = action.payload;
                state.filtersLoadingStatus = 'idle';
            })
            .addCase(fetchFilters.rejected, state => {state.filtersLoadingStatus = 'error'})
            .addDefaultCase(() => {})
    }
});

const { actions, reducer } = filtersSlice;

export default reducer;
export const { filterChanged } = actions;
