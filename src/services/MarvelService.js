class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=2ba92860ed936b4d5298bdbf8331025a';

    getResources = async (url) => {
        const res = await fetch(url)

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`)
        }

        return await res.json();
    }

    getAllCharacters = async () => {
        const res = await this.getResources(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
        return res.data.results.map(this._transformCharacter)
    }

    getCharacter = async (id) => {
        const res = await this.getResources(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transformCharacter(res.data.results[0])
    }

    _transformCharacter = ({name, description, thumbnail: {path, extension}, urls: [{url}, {url : wiki}]}) => {
        description = description.length > 225 ? description.slice(0, 224) + '...' : description;
        description = !description.length ? 'Looks like Kratos stole the description' : description

        return {
            name: name,
            description: description,
            thumbnail: `${path}.${extension}`,
            homepage: url,
            wiki: wiki
        }
    }
}

export default MarvelService