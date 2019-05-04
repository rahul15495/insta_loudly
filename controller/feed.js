const axios = require('axios');
var querystring = require('querystring');

const BASE_URL = 'https://www.instagram.com'


module.exports.getFeedData = (queryId, data, follwers, userId) => {

    let feed = data.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media;
    let out = []

    total_posts = feed.count;
    has_next_page = feed.page_info.has_next_page;
    end_cursor = feed.page_info.end_cursor;

    posts = feedProcessor(feed, follwers, userId, queryId, end_cursor);

    return {
        total_posts: total_posts,
        posts: posts
    }
}

const feedProcessor = (feed, follwers, userId, query_hash, end_cursor) => {

    allPosts = feed.edges.map(post => {
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

    let after = allPosts[allPosts.length - 1].id;

    generateLink(userId, query_hash, end_cursor)
        .then(r => {
            console.log(r.statusCode)
            console.log(r.responseUrl)
        })

    return allPosts;
}


const getMentions = caption => {
    pattern = /\B@[a-z0-9_-]+/gi;

    return caption.match(pattern);
}

const generateLink = async (id, query_hash, after, first = 12) => {

    let variables = {
        "id": id,
        "first": first,
        "after": after
    }
    let response;

    params= querystring.stringify({
        query_hash: query_hash,
        variables: JSON.stringify(variables)
    });

    url= `${BASE_URL}/graphql/query/?${params}`


    console.log(url)


    try {

        // response = await axios({
        //     method: 'get',
        //     url: `${BASE_URL}/graphql/query/`,
        //     headers: {
        //         Referer: `${BASE_URL}/priyankachopra/`,
        //     }
        // });

        Promise.resolve(url)


    } catch (err) {
        console.log(err)
        // throw err;
    }

    return {}

}