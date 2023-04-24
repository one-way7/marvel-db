import useHttp from '../hooks/http.hook';

const useMarvelService = () => {
    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=2ba92860ed936b4d5298bdbf8331025a';
    const _baseOffset = 198;

    const { loading, error, request, clearError } = useHttp();

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(
            `${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`,
        );
        return res.data.results.map(_transformCharacter);
    };

    const getAllComics = async (offset = _baseOffset) => {
        const res = await request(
            `${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`,
        );
        return res.data.results.map(_transformComics);
    };

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);

        return _transformCharacter(res.data.results[0]);
    };

    const getComics = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    };

    const _transformCharacter = ({
        id,
        name,
        description,
        thumbnail: { path, extension },
        urls: [{ url }, { url: wiki }],
        comics: { items: comics },
    }) => {
        description =
            description.length > 225
                ? description.slice(0, 180) + '...'
                : description;

        return {
            name,
            description:
                description || 'Looks like Kratos stole the description',
            thumbnail: `${path}.${extension}`,
            homepage: url,
            wiki,
            id,
            comics,
        };
    };

    const _transformComics = ({
        id,
        title,
        description,
        pageCount,
        prices: [{ price }],
        thumbnail: { path, extension },
        textObjects: { language },
    }) => {
        return {
            id,
            title,
            description:
                description || 'Looks like Kratos stole the description',
            pageCount: pageCount
                ? `${pageCount} p.`
                : 'No information about the number of pages',
            price: price ? `${price}$` : 'not available',
            thumbnail: `${path}.${extension}`,
            language: language || 'en-us',
        };
    };

    return {
        loading,
        error,
        clearError,
        getCharacter,
        getAllCharacters,
        getAllComics,
        getComics,
    };
};

export default useMarvelService;
