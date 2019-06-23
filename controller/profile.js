const jp = require('jsonpath');
const parser = require("shift-parser");
const FEED = require('./feed')
const FOLLOWING = require('./following')

const BASE_URL = 'https://www.instagram.com'

var requiredPersonalData = ['biography',
    'external_url',
    'edge_followed_by.count',
    'edge_follow.count',
    'full_name',
    'id',
    'is_business_account',
    'is_joined_recently',
    'business_category_name',
    'is_private',
    'is_verified',
    'profile_pic_url_hd',
    'username'
]


const getInfo = (user) => {
    let out = {};

    requiredPersonalData.forEach(field => {
        let key = field.split('.');
        let value;

        if (key.length == 1) {
            value = user[key[0]]
        } else {

            let temp = user;
            key.forEach(k => {
                temp = temp[k]
            })

            value = temp
        }

        key = key[0]

        out[key] = value

    })

    return out
}

module.exports.visitProfile = async(Session) => {
    let response;

    response = await Session._client.get(`/${Session._userHandle}/`)

    //console.log(response.status)

    //Session.cookie = response.headers['set-cookie']

    Session.referer = response.config.url

    return response;

}



module.exports.getProfileData = async(Session) => {

    let response;

    try {

        response = await this.visitProfile(Session);

        Session._query_id_link = `${response.data.match('/static/bundles/es6/ProfilePageContainer(.*).js')[0]}`


        //console.log(Session._query_id_link)

    } catch (err) {
        console.log(err)
        throw err;
    }

    await getQueryid(Session)
        .then(r => {
            Session.query_id = r;
        });

    const data = JSON.parse(response.data.match(/<script type="text\/javascript">window._sharedData = (.*);<\/script>/)[1]) || {};

    let personalInfo = getInfo(data.entry_data.ProfilePage[0].graphql.user)

    Session.userId = personalInfo.id

    let postData = await FEED.getFeedData(Session, data, personalInfo.edge_followed_by)

    return {
        info: personalInfo,
        feed: postData
    };
}

const getQueryid = async(Session) => {

    let response;

    try {

        response = await Session._client.get(Session._query_id_link)

    } catch (err) {
        console.log(err)
        throw err;
    }

    let jsFiles = response.data.split('\n');

    let query_ids = [];

    jsFiles.forEach(temp => {

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

    //console.log(query_ids)

    return query_ids[2]

}

module.exports.extractFollowing = async(Session) => {
    let response;
    var out
    try {

        response = await this.visitProfile(Session);

        //console.log(response.data)

        Session._following_query_id_link = `${response.data.match('/static/bundles/es6/Consumer.js(.*).js')[0]}`


        //console.log(Session._following_query_id_link)

        await getFollowingQueryid(Session)
            .then(r => {
                Session.following_query_id = r;
            })

        const data = JSON.parse(response.data.match(/<script type="text\/javascript">window._sharedData = (.*);<\/script>/)[1]) || {};

        let personalInfo = getInfo(data.entry_data.ProfilePage[0].graphql.user)

        Session.userId = personalInfo.id

        out = await FOLLOWING.getFollowing(Session);

    } catch (err) {
        console.log(err)
        throw err;
    }

    //console.log(out)

    return {
        'following': out
    }
}

const getFollowingQueryid = async(Session) => {

    let response;

    try {

        response = await Session._client.get(Session._following_query_id_link)

    } catch (err) {
        console.log(err)
        throw err;
    }

    //console.log(response.data)

    //edge_follow

    let jsFiles = response.data.split('\n');

    let query_ids = [];

    jsFiles.forEach(line => {
        matches = line.match('FOLLOW_LIST_REQUEST_UPDATED,(.*)')
        if (matches) {
            parser.parseScript(line).statements.forEach(data => {
                //$..declarators[?(@.binding.name=="n")].init.value
                jp.query(data, '$..declarators[?(@.binding.name=="n")].init.value')
                    .forEach(each => {
                        query_ids.push(each);
                    })

            })
        }
    })

    return query_ids[0]


}