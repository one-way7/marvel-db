import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import useMarvelService from '../../../services/MarvelService';
import Spinner from '../../spinner/Spinner';
import ErrorMessage from '../../errorMessage/ErrorMessage';
import AppBanner from '../../appBanner/AppBanner';

import './singleCharPage.scss';

const SingleComicsPage = () => {
    const { charId } = useParams();
    const [char, setChar] = useState(null);
    const { loading, error, getCharacter, clearError } = useMarvelService();

    useEffect(() => {
        updateComics();
    }, [charId]);

    const updateComics = () => {
        clearError();

        getCharacter(charId).then(onCharLoaded);
    };

    const onCharLoaded = (result) => {
        setChar(result);
    };

    const spinner = loading ? <Spinner /> : null;
    const errorMessage = error ? <ErrorMessage /> : null;
    const view = !(loading || error || !char) ? <View char={char} /> : null;

    return (
        <>
            <AppBanner />
            {spinner}
            {errorMessage}
            {view}
        </>
    );
};

const View = ({ char }) => {
    const { name, description, thumbnail } = char;

    return (
        <div className="single-item">
            <img src={thumbnail} alt={name} className="single-item__img" />
            <div className="single-item__info">
                <h2 className="single-item__name">{name}</h2>
                <p className="single-item__descr">{description}</p>
            </div>
            <Link to="/" className="single-item__back">
                Back to all
            </Link>
        </div>
    );
};

export default SingleComicsPage;
