import { configureStore } from '@reduxjs/toolkit';
import heroes from '../components/heroesList/heroesSlice';
import filters from '../components/heroesFilters/filtersSlice';

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
    reducer: { heroes, filters },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware),
    devTools: process.env.NODE_ENV !== 'production',
    
})

export default store;
