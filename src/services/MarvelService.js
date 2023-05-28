import useHttp from '../hooks/http.hook';

const useMarvelService = () => {
    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=2ba92860ed936b4d5298bdbf8331025a';
    const _baseOffset = 198;

    const { loading, setLoading, error, request, clearError } = useHttp();

    const getAllCharacters = async (offset = _baseOffset) => {
        const pageCount = 9;
        const res = await request(
            `${_apiBase}characters?limit=${pageCount}&offset=${offset}&${_apiKey}`,
        );
        const characters = res.data.results.map(_transformCharacter);

        if (characters.length < pageCount) {
            characters.at(-1).isLastCharacter = true;
        }

        return characters;
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

    const getCharacterByName = async (name) => {
        const res = await request(
            `${_apiBase}characters?name=${name}&${_apiKey}`,
        );
        return _transformCharacter(res.data.results[0]);
    };

    const getComics = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    };

    const _transformCharacter = (person) => {
        if (person) {
            person.description =
                person.description.length > 225
                    ? person.description.slice(0, 180) + '...'
                    : person.description;

            return {
                name: person.name,
                description:
                    person.description ||
                    'Looks like Kratos stole the description',
                thumbnail: `${person.thumbnail.path}.${person.thumbnail.extension}`,
                homepage: person.homepage,
                wiki: person.wiki,
                id: person.id,
                comics: person.comics.items,
            };
        } else {
            return undefined;
        }
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
        setLoading,
        error,
        clearError,
        getCharacter,
        getCharacterByName,
        getAllCharacters,
        getAllComics,
        getComics,
    };
};

export default useMarvelService;
