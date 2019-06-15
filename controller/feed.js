const axios = require('axios');
var querystring = require('querystring');

const BASE_URL = 'https://www.instagram.com'


module.exports.getFeedData = async(Session, data, follwers) => {

    let feed = data.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media;
    let out = []

    let total_posts = feed.count;
    let has_next_page = feed.page_info.has_next_page;
    let end_cursor = feed.page_info.end_cursor;

    let posts = []

    posts = feedProcessor(feed, follwers, posts);

    while (has_next_page && posts.length <= 100) {
        link = generateLink(Session, end_cursor)

        try {
            // console.log(link)
            response = await Session._client.get(link)

            if (response.status == 200) {

                feed = response.data;

                if (feed.status == 'ok') {

                    feed = feed.data.user.edge_owner_to_timeline_media

                    posts = feedProcessor(feed, follwers, posts)

                    has_next_page = feed.page_info.has_next_page;
                    end_cursor = feed.page_info.end_cursor;

                } else {
                    throw "Error in extracting Feed"
                }

            } else {
                throw "response status :" + String(response.status)
            }

        } catch (err) {
            console.error(err)
            break;
        }
    }

    return {
        total_posts: total_posts,
        collected_posts: posts.length,
        posts: posts
    }
}

const feedProcessor = (feed, follwers, allPosts = []) => {

    _posts = feed.edges.map(post => {
        post = post.node;

        let likes
        try {
            likes = post.edge_liked_by.count;
        } catch (err) {
            likes = post.edge_media_preview_like.count
        }

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

    allPosts = allPosts.concat(_posts)

    let after = allPosts[allPosts.length - 1].id;

    return allPosts;
}


const getMentions = caption => {
    pattern = /\B@[a-z0-9_-]+/gi;

    return caption.match(pattern);
}

const generateLink = (Session, after, first = 12) => {

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

    url = `${BASE_URL}/graphql/query/?${params}`

    return url


}