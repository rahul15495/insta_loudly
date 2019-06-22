session = require('./core/session');

let res;

var Session = new session.Session('priyankachopra');

initial_link = 'https://www.instagram.com/accounts/login/?source=auth_switcher'
Session._client.get(initial_link).then(r => {
    console.log('done');
    res = r
})

Session.cookie = res.headers['set-cookie']

csrf = res.headers['set-cookie'][7].split(';')[0].replace('csrftoken=', '')

Session.csrf = csrf;

let LOGIN_URL = 'https://www.instagram.com/accounts/login/ajax/'


body = {
    'username': 'rahul.8d@gmail.com',
    'password': 'chaurasia15',
    'queryParams': JSON.stringify({
        "source": "auth_switcher"
    }),
    'optIntoOneTap': true
}

let res2;

Session._client.post(LOGIN_URL, querystring.stringify(body)).then(r => {
    console.log('done');
    res2 = r
}).catch(console.error)

Session.cookie = res2.headers['set-cookie']

/*
set-cookie: sessionid=""; Domain=instagram.com; expires=Thu, 01-Jan-1970 00:00:00 GMT; Max-Age=0; Path=/
set-cookie: sessionid=""; Domain=.instagram.com; expires=Thu, 01-Jan-1970 00:00:00 GMT; Max-Age=0; Path=/
set-cookie: sessionid=""; Domain=i.instagram.com; expires=Thu, 01-Jan-1970 00:00:00 GMT; Max-Age=0; Path=/
set-cookie: sessionid=""; Domain=.i.instagram.com; expires=Thu, 01-Jan-1970 00:00:00 GMT; Max-Age=0; Path=/
set-cookie: sessionid=""; Domain=www.instagram.com; expires=Thu, 01-Jan-1970 00:00:00 GMT; Max-Age=0; Path=/
set-cookie: sessionid=""; Domain=.www.instagram.com; expires=Thu, 01-Jan-1970 00:00:00 GMT; Max-Age=0; Path=/
set-cookie: sessionid=""; expires=Thu, 01-Jan-1970 00:00:00 GMT; Max-Age=0; Path=/
set-cookie: csrftoken=n3jDNkcjdG1lhG1oLb785N8UbfZNDuep; Domain=.instagram.com; expires=Sat, 20-Jun-2020 18:11:40 GMT; Max-Age=31449600; Path=/; Secure
set-cookie: rur=PRN; Domain=.instagram.com; HttpOnly; Path=/; Secure
status: 200
strict-transport-security: max-age=31536000
vary: Cookie, Accept-Language, Accept-Encoding
x-aed: 1
x-content-type-options: nosniff
x-fb-trip-id: 1679558926
x-frame-options: SAMEORIGIN
x-xss-protection: 0




X-Instagram-AJAX: e64c89747fb7

*/