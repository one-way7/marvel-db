import './charInfo.scss';
import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import Skeleton from '../skeleton/Skeleton';
import ErrorMessage from '../errorMessage/ErrorMessage';

class CharInfo extends Component {
    state = {
        char: null,
        loading: false,
        error: false,
    };

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
    }

    componentDidUpdate(prevProps) {
        if (this.props.charId !== prevProps.charId) {
            this.updateChar();
        }
    }

    updateChar = () => {
        const { charId } = this.props;

        if (!charId) {
            return;
        }

        this.onCharLoading();

        this.marvelService
            .getCharacter(charId)
            .then((res) => this.onCharLoaded(res))
            .catch(this.onError);
    };

    onCharLoaded = (char) => {
        this.setState({
            char: char,
            loading: false,
        });
    };

    onCharLoading = () => {
        this.setState(() => ({
            loading: true,
        }));
    };

    render() {
        const { char, loading, error } = this.state;

        const skeleton = !(loading || error || char) ? <Skeleton /> : null;
        const spinner = loading ? <Spinner /> : null;
        const errorMessage = error ? <ErrorMessage /> : null;
        const view = !(spinner || errorMessage || skeleton) ? (
            <View char={char} />
        ) : null;

        return (
            <div className="char__info">
                {skeleton}
                {spinner}
                {errorMessage}
                {view}
            </div>
        );
    }
}

const View = ({ char }) => {
    const { name, description, thumbnail, homepage, wiki, comics } = char;
    const styleObjectFit = /not_available.jpg$/.test(thumbnail)
        ? { objectFit: 'contain' }
        : null;

    const listOfComics = comics.map(({ name }, i) => {
        if (i > 9) return;
        return <Comics name={name} key={i} />;
    });

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={styleObjectFit} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">{description}</div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {listOfComics.length === 0
                    ? "The character hasn't managed to get into any\n comics yet"
                    : null}
                {listOfComics}
            </ul>
        </>
    );
};

const Comics = ({ name }) => {
    return <li className="char__comics-item">{name}</li>;
};

export default CharInfo;
