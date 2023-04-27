import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFilters, filterChanged } from "../../actions";
import { useHttp } from "../../hooks/http.hook";
import Spinner from "../spinner/Spinner";

const HeroesFilters = () => {
    const {filters, filtersLoadingStatus, filter} = useSelector(state => state.filters);

    const dispatch = useDispatch();
    const { request } = useHttp();

    useEffect(() => {
        dispatch(fetchFilters(request))
        // eslint-disable-next-line
    }, []);

    if (filtersLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Loading error</h5>
    }

    const buttons = filters.length 
        ? filters.map(({name, id, classes}) => {
            return (
                <button key={id}
                    className={`btn btn-${classes} ${name === filter && 'active'}`} 
                    onClick={() => dispatch(filterChanged(name))}>
                    {name[0].toUpperCase() + name.slice(1)}
                </button>)
        })
        : null;
    
    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Filter heroes by their power</p>
                <div className="btn-group">
                    {buttons}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;