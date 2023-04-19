import './charList.scss';
import abyss from '../../resources/img/abyss.jpg';
import {Component} from "react";
import MarvelService from "../../services/MarvelService";
import spinner from "../spinner/Spinner";
import errorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

class CharList extends Component {

    state = {
        chars: {},
        loading: true,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.getCharacters()
    }

    getCharacters = () => {
        this.marvelService
            .getAllCharacters()
            .then(item => this.setState({
                chars: item,
                loading: false
            }))
            .catch(() => this.setState({
                loading: false,
                error: true
            }))
    }

    render() {
        const {chars, loading, error} = this.state
        const spinner = loading ? <Spinner/> : null
        const errorMessage = error ? <ErrorMessage/> : null
        const styleBlock = (spinner || errorMessage) ? {display: 'block'} : null;

        const view = (spinner || errorMessage) ? null : chars.map(({name, thumbnail}) => {
            return <View name={name} thumbnail={thumbnail}/>
        })

        return (
            <div className="char__list">
                <ul className="char__grid" style={styleBlock}>
                    {spinner}
                    {errorMessage}
                    {view}
                </ul>
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

const View = ({name, thumbnail}) => {
    const styleObjectFit = /not_available.jpg$/.test(thumbnail) ? {objectFit: 'contain'} :
        null

    return (
        <li className="char__item">
            <img src={thumbnail} alt="abyss" style={styleObjectFit}/>
            <div className="char__name">{name}</div>
        </li>
    )
}

export default CharList;