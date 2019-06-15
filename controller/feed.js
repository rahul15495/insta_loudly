const axios = require('axios');
var querystring = require('querystring');

const BASE_URL = 'https://www.instagram.com'


module.exports.getFeedData = (Session, data, follwers) => {

    let feed = data.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media;
    let out = []

    total_posts = feed.count;
    has_next_page = feed.page_info.has_next_page;
    end_cursor = feed.page_info.end_cursor;

    posts = feedProcessor(feed, follwers, Session, end_cursor);

    return {
        total_posts: total_posts,
        posts: posts
    }
}

const feedProcessor = (feed, follwers, Session, end_cursor) => {

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

    generateLink(Session, end_cursor)
        .then(r => {
            console.log(r.status)
        })

    return allPosts;
}


const getMentions = caption => {
    pattern = /\B@[a-z0-9_-]+/gi;

    return caption.match(pattern);
}

const generateLink = async(Session, after, first = 12) => {

    let variables = {
        "id": Session._userId,
        "first": first,
        "after": after
    }
    let response;

    params = querystring.stringify({
        query_hash: Session._query_id,
        variables: JSON.stringify(variables)
    });

    url = `/graphql/query/?${params}`


    console.log(url)


    try {

        response = await Session._client.get(url)


    } catch (err) {
        // console.error(err)
        // throw err;
        {}
    }

    return response

}