import {useHttp} from '../../hooks/http.hook';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHeroes, heroDelete, visibleHeroesSelector } from '../heroesList/heroesSlice';
import { useGetHeroesQuery } from '../../api/apiSlice';

import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './heroesList.scss';

const HeroesList = () => {
    const {
        data: heroes = [],
        isFetching,
        isLoading,
        // isSuccess,
        isError,
        // error
    } = useGetHeroesQuery();

    const activeFilter = useSelector(state => state.filters.filter);

    const visibleHeroes = useMemo(() => {
        const filteredHeroes = [...heroes];

        if (activeFilter === 'all') {
            return filteredHeroes;
        } else {
            return filteredHeroes.filter(hero => hero.element === activeFilter);
        }

        // eslint-disable-next-line
    }, [heroes, activeFilter]);

    // const visibleHeroes = useSelector(visibleHeroesSelector);
    // const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus);
    const dispatch = useDispatch();
    const { request } = useHttp();

    useEffect(() => {
        dispatch(fetchHeroes());
        // eslint-disable-next-line
    }, []);

    const handleDelete = useCallback((id) => {
        request(`http://localhost:3001/heroes/${id}`, 'DELETE')
            .then(data => console.log(data, 'DELETED'))
            .then(dispatch(heroDelete(id)))
            .catch(err => console.log(err))
        // eslint-disable-next-line 
    }, [request]);

    if (isLoading || isFetching) {
        return <Spinner/>;
    } else if (isError) {
        return <h5 className="text-center mt-5">Loading error</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <CSSTransition timeout={0} classNames="hero">
                <h5 className="text-center mt-5">No heroes so far</h5>
            </CSSTransition>
        }

        return arr.map(({id, ...props}) => {
            return (
                <CSSTransition timeout={500} key={id} classNames="hero">
                    <HeroesListItem {...props} handleDelete={() => handleDelete(id)} />
                </CSSTransition>
            )
        })
    }

    const elements = renderHeroesList(visibleHeroes);
    return (
        <TransitionGroup component='ul' >
            {elements}
        </TransitionGroup>
    )
}

export default HeroesList;

// {
//   "id": 1,
//   "name": "The Prime Hero",
//   "description": "Number one in rating!",
//   "element": "fire"
// },
// {
//   "id": 2,
//   "name": "Unknown Hero",
//   "description": "Hiding in shadows",
//   "element": "wind"
// },
// {
//   "id": 3,
//   "name": "Marine Hero",
//   "description": "Like Aquaman, but not from the DC",
//   "element": "water"
// }