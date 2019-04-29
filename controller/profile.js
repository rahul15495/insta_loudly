const axios = require('axios');
const cheerio = require('cheerio');



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

const getFeedData = (feed, follwers) => {
    let out = []

    total_posts = feed.count;

    posts = feed.edges.map(post => {
        post = post.node;

        let likes = post.edge_liked_by.count;
        let comments = post.edge_media_to_comment.count;
        let engagement_rate = (likes + comments) / follwers

        return {
            id: post.id,
            caption: post.edge_media_to_caption.edges[0].node.text,
            shortcode: post.shortcode,
            comments: comments,
            taken_at_timestamp: feed.taken_at_timestamp,
            likes: likes,
            location: post.location,
            img: post.thumbnail_src,
            mentions: getMentions(post.edge_media_to_caption.edges[0].node.text),
            engagement_rate: engagement_rate.toFixed(3)
        }
    });

    return {
        total_posts: total_posts,
        posts: posts
    }
}

const getMentions = caption => {
    pattern = /\B@[a-z0-9_-]+/gi;

    return caption.match(pattern);
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

    let postData = getFeedData(data.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media, personalInfo.edge_followed_by)

    return {
        info: personalInfo,
        feed: postData
    };
}