import { configureStore } from '@reduxjs/toolkit';
import filters from '../components/heroesFilters/filtersSlice';
import { apiSlice } from '../api/apiSlice';

// 1st argument can be (store) OR store destructured ({dispatch, getState})
// 2nd argumant is dispatch, called next (because it is a chain of dispatch fns in future)
const stringMiddleware = () => next => action => { 
    if (typeof action === 'string') {
        return next({
            type: action
        })
    }

    return next(action);
}

const store = configureStore({
    reducer: { filters, [apiSlice.reducerPath]: apiSlice.reducer },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware, apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
    
})

export default store;
