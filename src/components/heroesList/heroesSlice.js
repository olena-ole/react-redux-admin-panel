import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { useHttp } from '../../hooks/http.hook';

const heroesAdapter = createEntityAdapter();

const initialState = heroesAdapter.getInitialState({heroesLoadingStatus: 'idle'});

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
            heroesAdapter.removeOne(state, action.payload);
        },
        heroAdded: (state, action) => {
            heroesAdapter.addOne(state, action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHeroes.pending, state => {state.heroesLoadingStatus = 'loading'})
            .addCase(fetchHeroes.fulfilled, (state, action) => {
                heroesAdapter.setAll(state, action.payload);
                state.heroesLoadingStatus = 'idle';
            })
            .addCase(fetchHeroes.rejected, state => {state.heroesLoadingStatus = 'error'})
            .addDefaultCase(() => {})
    }
});

const { actions, reducer } = heroesSlice;

export default reducer;

// entities (prev state.heroes) are now saved as object, therefore selectAll returns array with heroes
const { selectAll } = heroesAdapter.getSelectors(state => state.heroes); 

export const visibleHeroesSelector = createSelector(
    state => state.filters.filter,
    selectAll,
    (filter, heroes) => {
        if (filter === 'all') {
            return heroes;
        } else {
            return heroes.filter(hero => hero.element === filter);
        }
    }
)

export const {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    heroDelete,
    heroAdded
} = actions;

