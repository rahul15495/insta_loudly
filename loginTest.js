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

csrf = res2.headers['set-cookie'][7].split(';')[0].replace('csrftoken=', '')

Session.csrf = csrf;

console.log(res2.headers)
console.log(Object.keys(res2))
console.log(res2.data)


/*
[ 'target=""; Domain=instagram.com; expires=Thu, 01-Jan-1970 00:00:00 GMT; Max-Age=0; Path=/',
  'target=""; Domain=.instagram.com; expires=Thu, 01-Jan-1970 00:00:00 GMT; Max-Age=0; Path=/',
  'target=""; Domain=i.instagram.com; expires=Thu, 01-Jan-1970 00:00:00 GMT; Max-Age=0; Path=/',
  'target=""; Domain=.i.instagram.com; expires=Thu, 01-Jan-1970 00:00:00 GMT; Max-Age=0; Path=/',
  'target=""; Domain=www.instagram.com; expires=Thu, 01-Jan-1970 00:00:00 GMT; Max-Age=0; Path=/',
  'target=""; Domain=.www.instagram.com; expires=Thu, 01-Jan-1970 00:00:00 GMT; Max-Age=0; Path=/',
  'target=""; expires=Thu, 01-Jan-1970 00:00:00 GMT; Max-Age=0; Path=/',
  'csrftoken=sA2HQ5X5nLxKetSzdybw34ovATcH2q37; Domain=.instagram.com; expires=Sun, 21-Jun-2020 10:30:08 GMT; Max-Age=31449600; Path=/; Secure',
  'shbid=3199; Domain=.instagram.com; expires=Sun, 30-Jun-2019 10:30:08 GMT; HttpOnly; Max-Age=604800; Path=/; Secure',
  'shbts=1561285808.099859; Domain=.instagram.com; expires=Sun, 30-Jun-2019 10:30:08 GMT; HttpOnly; Max-Age=604800; Path=/; Secure',
  'rur=ATN; Domain=.instagram.com; HttpOnly; Path=/; Secure',
  'mid=XQ9UrwAEAAHNKGh0KlKpK6DvqXmz; Domain=.instagram.com; expires=Wed, 20-Jun-2029 10:30:08 GMT; Max-Age=315360000; Path=/; Secure',
  'ds_user_id=1259032718; Domain=.instagram.com; expires=Sat, 21-Sep-2019 10:30:08 GMT; Max-Age=7776000; Path=/; Secure',
  'sessionid=1259032718%3AueUoUANY7T9fzA%3A8; Domain=.instagram.com; expires=Mon, 22-Jun-2020 10:30:08 GMT; HttpOnly; Max-Age=31536000; Path=/; Secure',
  '__to_be_deleted__instagram.com=""; Domain=instagram.com; expires=Thu, 01-Jan-1970 00:00:00 GMT; Max-Age=0; Path=/' ]
  */

/*
session = require('./core/session');
var Session = new session.Session('priyankachopra');

Session.login().then(_=>{console.log('yay')});
*/

/*
ig_cb=1; rur=FRC; csrftoken=yA6L60mFhyqAZ6la2GaxkxN8C96xxy6T; mid=XRt9qwAEAAHyK68XpBkrrTrRD3qx; urlgen="{\"46.101.57.114\": 14061}:1hiL55:C6E26vCUYZkymmakvtVy1lfIl3A"

*/
/*
csrftoken=yA6L60mFhyqAZ6la2GaxkxN8C96xxy6T; Domain=.instagram.com; expires=Tue, 30-Jun-2020 15:54:19 GMT; Max-Age=31449600; Path=/; Secure
*/

let test = async() => {
    out = await inquirer.prompt([{
        type: 'input',
        name: 'code',
        message: 'Enter code',
    }])

    console.log(out);
}