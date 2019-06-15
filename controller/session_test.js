const session = require('../core/session');


let userHandle = '_ishwari_'

var Session = new session.Session(userHandle)

let response;

Session._client.get(`/${userHandle}/`)
    .then(r => {
        response = r;
        console.log(response.status)

        Session.cookie = response.headers['set-cookie']
        Session.referer = response.config.url
    })



query_ids = []

jsfiles.forEach(temp => {

    try {

        parser.parseScript(temp).statements.forEach(data => {
            jp.query(data, '$..properties[?(@.name.value=="queryId")]')
                .forEach(each => {
                    query_ids.push(each.expression.value);
                })

        })

    } catch (err) {
        matches = temp.match('queryId:"(.*)",')
        if (matches) {
            query_ids.push(matches[1])
        }

    }


})

console.log(query_ids)