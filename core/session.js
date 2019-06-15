const Client = require('../core/request');


class Session {

    constructor(userHandle) {
        this._userHandle = userHandle;
        this._baseUrl = 'https://www.instagram.com';
        this._client = Client.client;
        this._cookie = null;
        this._referer = this.baseUrl;
        this._profileResponseData = null;
        this._query_id_link = null;
        this._query_id = null;
        this._userId = null;
    }

    set cookie(newCookie) {
        this._cookie = newCookie;
        this.setClientHeader('cookie');
    }

    set referer(newReferer) {
        this._referer = newReferer;
        this.setClientHeader('referer');
    }

    set profileData(data) {
        this._profileData = data;
    }

    set query_id_link(link) {
        this._query_id_link = link;
    }

    set query_id(id) {
        this._query_id = id;
    }

    set userId(id) {
        this._userId = id;
    }

    setClientHeader(arg) {

        switch (arg) {

            case 'cookie':
                this._client.defaults.headers['Cookie'] = this._cookie;
                break;

            case 'referer':
                this._client.defaults.headers['Referer'] = this._referer;
                break;

            default:
                {}
        }

    }
}

module.exports.Session = Session;