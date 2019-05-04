const axios = require('axios');
const jp = require('jsonpath');
const parser = require("shift-parser");
const FEED = require('./feed')

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

            let temp = user
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

module.exports.getProfileData = async (userHandle) => {

    let response;

    let queryId;

    try {

        response = await axios({
            method: 'get',
            url: `${BASE_URL}/${userHandle}/`,
            headers: {
                Referer: `${BASE_URL}/${userHandle}/`,
            },
        });

    } catch (err) {
        console.log(err)
        throw err;
    }

    await getQueryid(userHandle, response)
        .then(r => {
            queryId = r;
        });

    const data = JSON.parse(response.data.match(/<script type="text\/javascript">window._sharedData = (.*);<\/script>/)[1]) || {};

    let personalInfo = getInfo(data.entry_data.ProfilePage[0].graphql.user)

    let postData = FEED.getFeedData(queryId ,data, personalInfo.edge_followed_by,personalInfo.id)

    return {
        info: personalInfo,
        feed: postData
    };
}

const getQueryid = async (userHandle, _response) => {

    let query_id_link = `${BASE_URL}${_response.data.match('/static/bundles/metro/ProfilePageContainer(.*).js')[0]}`

    let response;

    try {

        response = await axios({
            method: 'get',
            url: query_id_link,
            headers: {
                Referer: `${BASE_URL}/${userHandle}/`,
            },
        });

    } catch (err) {
        console.log(err)
        throw err;
    }

    let jsFiles = parser.parseScript(response.data);

    let query_ids =[]

    jsFiles.statements.forEach(data => {

        jp.query(data, '$..properties[?(@.name.value=="queryId")]')
            .forEach(each => {
            query_ids.push(each.expression.value) ;
        })
    })

    console.log(query_ids)

    return query_ids[2]

}