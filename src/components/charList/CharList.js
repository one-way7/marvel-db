import './charList.scss';
import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        offset: 210,
        newItemLoading: false,
        charEnded: false,
    };

    marvelService = new MarvelService();

    componentDidMount() {
        this.getCharacters();
    }

    getCharacters = (offset) => {
        this.onCharListLoading();

        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(() =>
                this.setState({
                    loading: false,
                    error: true,
                    newItemLoading: false,
                }),
            );
    };

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true,
        });
    };

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        this.setState(({ charList, offset }) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            offset: offset + newCharList.length,
            newItemLoading: false,
            charEnded: ended,
        }));
    };

    renderItems = (chars) => {
        return chars.map(({ name, thumbnail, id }) => {
            return (
                <View
                    name={name}
                    thumbnail={thumbnail}
                    key={id}
                    id={id}
                    onCharSelected={this.props.onCharSelected}
                />
            );
        });
    };

    render() {
        const { charList, loading, error, offset, newItemLoading, charEnded } =
            this.state;
        const spinner = loading ? <Spinner /> : null;
        const errorMessage = error ? <ErrorMessage /> : null;
        const styleBlock =
            spinner || errorMessage ? { display: 'block' } : null;

        const view =
            spinner || errorMessage ? null : this.renderItems(charList);

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
                    onClick={() => this.getCharacters(offset)}
                >
                    <div className="inner">load more</div>
                </button>
            </div>
        );
    }
}

const View = ({ name, thumbnail, id, onCharSelected }) => {
    const styleObjectFit = /not_available.jpg$/.test(thumbnail)
        ? { objectFit: 'contain' }
        : null;

    return (
        <li className="char__item" onClick={() => onCharSelected(id)}>
            <img src={thumbnail} alt="abyss" style={styleObjectFit} />
            <div className="char__name">{name}</div>
        </li>
    );
};

export default CharList;
