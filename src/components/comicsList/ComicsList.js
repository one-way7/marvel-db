import { useState, useEffect } from 'react';
import useMarvelService from '../../services/MarvelService';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import { Link } from 'react-router-dom';

import './comicsList.scss';

const ComicsList = () => {
    const [listComics, setComics] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(214);
    const [ended, setEnded] = useState('block');
    const { loading, error, getAllComics } = useMarvelService();

    useEffect(() => getComics(), []);
    const getComics = () => {
        const firstLoading = listComics.length === 0 ? false : true;
        setNewItemLoading(firstLoading);

        getAllComics(offset).then(onComicsLoaded);
    };

    const onComicsLoaded = (newItem) => {
        let ended = newItem.length < 8 ? 'none' : 'block';
        setEnded(ended);

        setOffset((offset) => offset + newItem.length);
        setNewItemLoading(false);
        setComics((item) => [...item, ...newItem]);
    };

    const renderItems = () => {
        return listComics.map((item) => {
            const { id, title, url, thumbnail, price } = item;
            const styleObjectFit = /not_available.jpg$/.test(thumbnail)
                ? { objectFit: 'contain' }
                : null;

            return (
                <li key={id} className="comics__item">
                    <Link to={`${id}`}>
                        <img
                            src={thumbnail}
                            alt={title}
                            className="comics__item-img"
                            style={styleObjectFit}
                        />
                        <div className="comics__item-name">{title}</div>
                        <div className="comics__item-price">{price}</div>
                    </Link>
                </li>
            );
        });
    };

    const spinner = loading && !newItemLoading ? <Spinner /> : null;
    const errorMessage = error ? <ErrorMessage /> : null;
    const styleBlock = spinner || errorMessage ? { display: 'block' } : null;
    const comics = spinner || errorMessage ? null : renderItems();

    return (
        <div className="comics__list">
            <ul className="comics__grid" style={styleBlock}>
                {spinner}
                {comics}
            </ul>
            <button
                disabled={newItemLoading}
                className="button button__main button__long"
                onClick={getComics}
            >
                <div style={{ display: ended }} className="inner">
                    load more
                </div>
            </button>
        </div>
    );
};

export default ComicsList;
