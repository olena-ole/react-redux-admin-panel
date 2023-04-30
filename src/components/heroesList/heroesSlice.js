import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useHttp } from '../../hooks/http.hook';

const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle',
};

export const fetchHeroes = createAsyncThunk(
    'heroes/fetchHeroes',
    // usually async/await is used, but here it is used in hook, so it is unnecessary here
() => {
        const { request } = useHttp();
        return request("http://localhost:3001/heroes")
    }
);

const heroesSlice = createSlice({
    name: 'heroes',
    initialState,
    reducers: {
    // !!! in {}, we dont't return it, we mutate it using immer library (makes the initial state stay immutable)
        heroDelete: (state, action) => {
            state.heroes = state.heroes.filter(hero => hero.id !== action.payload)
        },
        heroAdded: (state, action) => {
            state.heroes.push(action.payload)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHeroes.pending, state => {state.heroesLoadingStatus = 'loading'})
            .addCase(fetchHeroes.fulfilled, (state, action) => {
                state.heroes = action.payload;
                state.heroesLoadingStatus = 'idle';
            })
            .addCase(fetchHeroes.rejected, state => {state.heroesLoadingStatus = 'error'})
            .addDefaultCase(() => {})
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

