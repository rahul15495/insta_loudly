const Client = require('../core/request');
const CONFIG = require('../config').config;
var querystring = require('querystring');
var inquirer = require("inquirer")

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
        this._following_query_id = null;
        this._following_query_id_link = null;
        this._csrf = null;
        this._challenge = {
            'status': false
        };
    }

    set userHandle(name) {
        this._userHandle = name;
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

    set following_query_id(id) {
        this._following_query_id = id;
    }

    set following_query_id_link(link) {
        this._following_query_id_link = link;
    }
    set csrf(token) {
        this._csrf = token;
        this.setClientHeader('csrf');
    }

    setClientHeader(arg) {

        switch (arg) {

            case 'cookie':
                this._client.defaults.headers['Cookie'] = this._cookie;
                break;

            case 'referer':
                this._client.defaults.headers['Referer'] = this._referer;
                break;

            case 'csrf':
                this._client.defaults.headers['X-CSRFToken'] = this._csrf;

            default:
                {}
        }

    }
    async login() {

        try {

            let res, res2;

            let initial_link = 'https://www.instagram.com/accounts/login/?source=auth_switcher'

            let LOGIN_URL = 'https://www.instagram.com/accounts/login/ajax/'

            res = await this._client.get(initial_link)

            this.cookie = res.headers['set-cookie']

            let token = res.headers['set-cookie'][7].split(';')[0].replace('csrftoken=', '')

            this.csrf = token;

            //console.log(CONFIG)

            let body = {
                'username': CONFIG.username,
                'password': CONFIG.password,
                'queryParams': JSON.stringify({
                    "source": "auth_switcher"
                }),
                'optIntoOneTap': true
            }

            res2 = await this._client.post(LOGIN_URL, querystring.stringify(body))


            if (res2.status == 200) {
                console.log('login success')
            } else {
                throw 'UNSUCESSFULL LOGIN ATTEMPT'
            }


            let _cookie = ''

            range(7, 7).forEach(index => {
                let a = res2.headers['set-cookie'][index]

                a = a.split(';')[0].split('=')
                _cookie = _cookie + `${a[0]}=${a[1]}; `
            })

            this.cookie = _cookie

        } catch (error) {

            try {
                if (error.response.data.message == 'checkpoint_required') {
                    console.log('challenge required')
                    this._challenge.checkpoint_url = error.response.data.checkpoint_url;

                    await challenge();
                    console.log('login success after challenge');
                } else {
                    throw error;
                }
            } catch (error) {
                console.error(error);
            }


        }
    }

    async challenge() {
        let checkpoint_url = this._challenge.checkpoint_url;
        Session.referer = checkpoint_url;


        if (CONFIG.challenge_choice == 1) {
            console.log('sending choice as email');
        } else {
            console.log('sending choice as sms');
        }

        await Session._client.post(checkpoint_url, querystring.stringify({
            'choice': CONFIG.challenge_choice
        }))

        console.log('message sent');

        let securityCode = await inquirer.prompt([{
            type: 'input',
            name: 'code',
            message: 'Enter code',
        }]).code;

        console.log(`Security Code Entered: ${securityCode}`)

        await Session._client.post(checkpoint_url, querystring.stringify({
            'security_code': securityCode
        }));

    }
}

function range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}

module.exports.Session = Session;