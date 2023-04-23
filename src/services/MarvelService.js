import useHttp from '../hooks/http.hook';

const useMarvelService = () => {
    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=2ba92860ed936b4d5298bdbf8331025a';
    const _baseOffset = 210;

    const { loading, error, request, clearError } = useHttp();

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(
            `${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`,
        );
        return res.data.results.map(_transformCharacter);
    };

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);

        return _transformCharacter(res.data.results[0]);
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
        description = !description.length
            ? 'Looks like Kratos stole the description'
            : description;

        return {
            name: name,
            description: description,
            thumbnail: `${path}.${extension}`,
            homepage: url,
            wiki: wiki,
            id: id,
            comics: comics,
        };
    };

    return { loading, error, getCharacter, getAllCharacters };
};

export default useMarvelService;
