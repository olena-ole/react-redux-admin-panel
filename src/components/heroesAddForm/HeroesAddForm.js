import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const schema = yup.object({
    name: yup.string()
        .required('enter the name of your hero')
        .min(3, 'must be at least 3 characters')
        .max(20, 'must be 20 characters max'),
    text: yup.string()
        .required('enter the description of your hero')
        .min(10, 'must be at least 10 characters')
        .max(50, 'must be 50 characters max'),
    element: yup.string().required('choose your element')
  }).required();

const HeroesAddForm = () => {
    const { register, handleSubmit, formState: { errors, isSubmitSuccessful }, reset } = useForm({
        mode: 'onSubmit',
        defaultValues: { name: '', text: '', element: '' },
        resolver: yupResolver(schema)
      });

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful])

    const onSubmit = data => {
        const newHero = {
            id: uuidv4(),
            ...data,
        }

        console.log(newHero);
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