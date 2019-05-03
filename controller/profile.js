const axios = require('axios');
const cheerio = require('cheerio');
const FEED =require('./feed')



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

    try {

        response = await axios({
            method: 'get',
            url: `https://www.instagram.com/${userHandle}/`,
            headers: {
                Referer: `https://www.instagram.com/${userHandle}/`,
            },
        });

    } catch (err){
        throw new Error() ;
    }
    
    const data = JSON.parse(response.data.match(/<script type="text\/javascript">window._sharedData = (.*);<\/script>/)[1]) || {};

    let personalInfo = getInfo(data.entry_data.ProfilePage[0].graphql.user)

    let postData = FEED.getFeedData(data.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media, personalInfo.edge_followed_by)

    return {
        info: personalInfo,
        feed: postData
    };
}