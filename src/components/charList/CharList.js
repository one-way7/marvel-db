import { useState, useEffect, useRef } from 'react';
import propTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = (props) => {
    const [charList, setCharList] = useState([]);
    const [offset, setOffset] = useState(210);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [charEnded, setCharEnded] = useState(false);

    const { loading, error, getAllCharacters } = useMarvelService();

    useEffect(() => {
        getCharacters();
    }, []);

    const getCharacters = (offset) => {
        const firstLoading = charList.length === 0 ? false : true;
        setNewItemLoading(firstLoading);

        getAllCharacters(offset).then(onCharListLoaded);
    };

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList((charList) => [...charList, ...newCharList]);
        setOffset((offset) => offset + newCharList.length);
        setNewItemLoading(false);
        setCharEnded(ended);
    };

    const itemsRef = useRef([]);

    const focusOnItem = (id) => {
        itemsRef.current.forEach((item) =>
            item.classList.remove('char__item_selected'),
        );
        itemsRef.current[id].classList.add('char__item_selected');
        itemsRef.current[id].focus();
    };

    const renderItems = (chars) => {
        return chars.map(({ name, thumbnail, id }, i) => {
            const styleObjectFit = /not_available.jpg$/.test(thumbnail)
                ? { objectFit: 'contain' }
                : null;

            return (
                <li
                    ref={(el) => (itemsRef.current[i] = el)}
                    key={id}
                    className="char__item"
                    onClick={() => {
                        props.onCharSelected(id);
                        focusOnItem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            props.onCharSelected(id);
                            focusOnItem(i);
                        }
                    }}
                    tabIndex={0}
                >
                    <img src={thumbnail} alt="abyss" style={styleObjectFit} />
                    <div className="char__name">{name}</div>
                </li>
            );
        });
    };

    const spinner = loading && !newItemLoading ? <Spinner /> : null;
    const errorMessage = error ? <ErrorMessage /> : null;
    const styleBlock = spinner || errorMessage ? { display: 'block' } : null;

    const view = spinner || errorMessage ? null : renderItems(charList);

    return (
        <div className="char__list">
            <ul className="char__grid" style={styleBlock}>
                {spinner}
                {errorMessage}
                {view}
            </ul>
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{ display: charEnded ? 'none' : 'block' }}
                onClick={() => getCharacters(offset)}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    );
};

CharList.propTypes = {
    onCharSelected: propTypes.func.isRequired,
};
export default CharList;
