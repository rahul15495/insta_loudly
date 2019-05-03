module.exports.getFeedData = (feed, follwers) => {
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
