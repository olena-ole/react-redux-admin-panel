import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { v4 as uuidv4 } from 'uuid';

import { useHttp } from '../../hooks/http.hook';
import { useDispatch } from 'react-redux';
import { heroAdded, heroesFetchingError } from '../../actions';

// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const schema = yup.object({
    name: yup.string()
        .required('enter the name of your hero')
        .min(2, 'must be at least 2 characters')
        .max(25, 'must be 25 characters max'),
    text: yup.string()
        .required('enter the description of your hero')
        .min(10, 'must be at least 10 characters')
        .max(50, 'must be 50 characters max'),
    element: yup.string().required('choose your element')
  }).required();

const HeroesAddForm = () => {
    const dispatch = useDispatch();
    const { request } = useHttp();

    const { register, handleSubmit, formState: { errors, isSubmitSuccessful }, reset } = useForm({
        mode: 'onSubmit',
        defaultValues: { name: '', text: '', element: '' },
        resolver: yupResolver(schema)
      });

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
        // eslint-disable-next-line
    }, [isSubmitSuccessful])

    const onSubmit = data => {
        const { name, text } = data;

        const capitalizedName = `${name.split(' ')
            .map(item => `${item[0].toUpperCase()}${item.slice(1).toLowerCase()}`)
            .join(' ')}`;

        const newHero = {
            ...data,
            id: uuidv4(),
            name: capitalizedName,
            description: `${text[0].toUpperCase()}${text.slice(1)}`
        };

        request('http://localhost:3001/heroes', 'POST', JSON.stringify(newHero))
            .then(data => console.log(data, 'ADDED'))
            .then(dispatch(heroAdded(newHero)))
            .catch(() => dispatch(heroesFetchingError()))
    };

    const errorMessageStyles = {color: "red", marginTop: "10px"};

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="border p-4 shadow-lg rounded">
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">New hero's name</label>
                <input 
                    required
                    type="text" 
                    {...register('name') } 
                    className="form-control" 
                    id="name" 
                    placeholder="What's my name?"/>
                <p style={errorMessageStyles}>{errors.name?.message}</p>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Description</label>
                <textarea
                    required
                    {...register('text', {required: true, minLength: 10, maxLength: 50})} 
                    className="form-control" 
                    id="text" 
                    placeholder="What can I do?"
                    style={{"height": '130px'}}/>
                <p style={errorMessageStyles}>{errors.text?.message}</p>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Choose the element of your hero</label>
                <select 
                    required
                    {...register('element', {required: true})}
                    className="form-select" 
                    id="element">
                    <option value="">I have the element of...</option>
                    <option value="fire">Fire</option>
                    <option value="water">Water</option>
                    <option value="wind">Wind</option>
                    <option value="earth">Earth</option>
                </select>
                <p style={errorMessageStyles}>{errors.element?.message}</p>
            </div>

            <button type="submit" className="btn btn-primary">Create</button>
        </form>
    )
}

export default HeroesAddForm;