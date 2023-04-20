class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=2ba92860ed936b4d5298bdbf8331025a';
    _baseOffset = 210;

    getResources = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };
    getAllCharacters = async (offset = this._baseOffset) => {
        const res = await this.getResources(
            `${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`,
        );
        return res.data.results.map(this._transformCharacter);
    };

    getCharacter = async (id) => {
        const res = await this.getResources(
            `${this._apiBase}characters/${id}?${this._apiKey}`,
        );

        return this._transformCharacter(res.data.results[0]);
    };

    _transformCharacter = ({
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
}

export default MarvelService;
