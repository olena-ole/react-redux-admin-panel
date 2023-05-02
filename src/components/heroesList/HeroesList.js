import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useGetHeroesQuery, useDeleteHeroMutation } from '../../api/apiSlice';

import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './heroesList.scss';

const HeroesList = () => {
    const {
        data: heroes = [],
        isFetching,
        isLoading,
        isError,
    } = useGetHeroesQuery();

    const [ deleteHero ] = useDeleteHeroMutation();

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

    const handleDelete = useCallback((id) => {
        deleteHero(id).unwrap();
        // eslint-disable-next-line 
    }, []);

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
