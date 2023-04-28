import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle',
}

const heroesSlice = createSlice({
    name: 'heroes',
    initialState,
    reducers: {
    // !!! in {}, we dont't return it, we mutate it using immer library (makes the initial state stay immutable)
        heroesFetching: state => {state.heroesLoadingStatus = 'loading'},
        heroesFetched: (state, action) => {
            state.heroes = action.payload;
            state.heroesLoadingStatus = 'idle';
        },
        heroesFetchingError: state => {state.heroesLoadingStatus = 'error'},
        heroDelete: (state, action) => {
            state.heroes = state.heroes.filter(hero => hero.id !== action.payload)
        },
        heroAdded: (state, action) => {
            state.heroes.push(action.payload)
        }
    }
});

const { actions, reducer } = heroesSlice;

export default reducer;
export const {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    heroDelete,
    heroAdded
} = actions;

