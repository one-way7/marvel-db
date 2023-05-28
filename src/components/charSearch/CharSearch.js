import { useState } from 'react';
import {
    Formik,
    Form,
    Field,
    ErrorMessage as FormikErrorMessage,
} from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charSearch.scss';

const CharSearch = () => {
    const [char, setChar] = useState(null);
    const { loading, error, clearError, getCharacterByName } =
        useMarvelService();

    const updateChar = (name) => {
        clearError();

        getCharacterByName(name).then((res) => setChar(res));
    };

    const errorMessage = error ? (
        <div className="char__search-critical-error">
            <ErrorMessage />
        </div>
    ) : null;

    const result = char ? (
        <div className="char__search-wrapper">
            <div className="char__search-success">
                There is! Visit {char.name} page?
            </div>
            <Link
                to={`characters/${char.id}`}
                className="button button__secondary"
            >
                <div className="inner">To page</div>
            </Link>
        </div>
    ) : char === undefined ? (
        <div className="char__search-error">
            The character was not found. Check the name and try again
        </div>
    ) : null;

    return (
        <div className="char__search-form">
            <Formik
                initialValues={{
                    name: '',
                }}
                validationSchema={Yup.object({
                    name: Yup.string().required('Character name is required..'),
                })}
                onSubmit={(values) => {
                    updateChar(values.name);
                }}
            >
                <Form>
                    <label className="char__search-label" htmlFor="name">
                        Or find a character by name:
                    </label>
                    <div className="char__search-wrapper">
                        <Field
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Enter name.."
                        />
                        <button
                            type="submit"
                            className="button button__main"
                            disabled={loading}
                        >
                            <div className="inner">Find</div>
                        </button>
                    </div>
                    <FormikErrorMessage
                        name="name"
                        className="char__search-error"
                        component="div"
                    />
                    {errorMessage}
                    {result}
                </Form>
            </Formik>
        </div>
    );
};

export default CharSearch;
