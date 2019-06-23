const axios = require('axios');
const _ = require('lodash');

const BASE_URL = 'https://www.instagram.com';

let client = axios.create({
    baseURL: BASE_URL,

    headers: {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip,deflate',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'Connection': 'Keep-Alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36',
        'X-IG-App-ID': '936619743392459',
        // 'X-Instagram-AJAX': 'e64c89747fb7',

    },
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
    withCredentials: true



})

module.exports.client = client;