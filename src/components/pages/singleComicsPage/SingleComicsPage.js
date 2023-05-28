import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import useMarvelService from '../../../services/MarvelService';
import Spinner from '../../spinner/Spinner';
import ErrorMessage from '../../errorMessage/ErrorMessage';
import AppBanner from '../../appBanner/AppBanner';

import './singleComicsPage.scss';

const SingleComicsPage = () => {
    const { comicsId } = useParams();
    const [comics, setComics] = useState(null);
    const { loading, error, getComics, clearError } = useMarvelService();

    useEffect(() => {
        updateComics();
    }, [comicsId]);

    const updateComics = () => {
        clearError();
        getComics(comicsId).then(onComicsLoaded);
    };

    const onComicsLoaded = (result) => {
        setComics(result);
    };

    const spinner = loading ? <Spinner /> : null;
    const errorMessage = error ? <ErrorMessage /> : null;
    const view = !(loading || error || !comics) ? (
        <View comics={comics} />
    ) : null;

    return (
        <>
            <AppBanner />
            {spinner}
            {errorMessage}
            {view}
        </>
    );
};

const View = ({ comics }) => {
    const { title, description, pageCount, thumbnail, language, price } =
        comics;

    return (
        <div className="single-comic">
            <img src={thumbnail} alt={title} className="single-comic__img" />
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount}</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{price}</div>
            </div>
            <Link to="/comics" className="single-comic__back">
                Back to all
            </Link>
        </div>
    );
};

export default SingleComicsPage;
