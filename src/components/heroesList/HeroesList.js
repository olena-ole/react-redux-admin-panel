import {useHttp} from '../../hooks/http.hook';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { heroesFetching, heroesFetched, heroesFetchingError, heroDelete } from '../../actions';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

const HeroesList = () => {
    const {heroes, heroesLoadingStatus, filter} = useSelector(state => state);
    const dispatch = useDispatch();
    const {request} = useHttp();
    
    const visibleHeroes = filter === 'all' 
        ? heroes 
        : heroes.filter(hero => hero.element === filter);

    useEffect(() => {
        dispatch(heroesFetching());
        request("http://localhost:3001/heroes")
            .then(data => dispatch(heroesFetched(data)))
            .catch(() => dispatch(heroesFetchingError()))

        // eslint-disable-next-line
    }, []);

    const handleDelete = useCallback((id) => {
        request(`http://localhost:3001/heroes/${id}`, 'DELETE')
            .then(data => console.log(data, 'DELETED'))
            .then(dispatch(heroDelete(id)))
            .catch(() => dispatch(heroesFetchingError()))
        // eslint-disable-next-line 
    }, [request]);

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Loading error</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">No heroes so far</h5>
        }

        return arr.map(({id, ...props}) => {
            return <HeroesListItem key={id} {...props} handleDelete={() => handleDelete(id)} />
        })
    }

    const elements = renderHeroesList(visibleHeroes);
    return (
        <ul>
            {elements}
        </ul>
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