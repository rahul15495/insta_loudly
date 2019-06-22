var querystring = require('querystring');

module.exports.getFollowing = async(Session) => {

    let following = []

    let link = generateLink(Session)

    try {

        let response = await Session._client.get(link);

        console.log(JSON.stringify(response.data));

        let feed = response.data.data.user.edge_follow;

        let total_following = feed.count;
        let has_next_page = feed.page_info.has_next_page;
        let end_cursor = feed.page_info.end_cursor;

        following = feedProcessor(feed, following);
        console.log(following);
    } catch (err) {
        console.log('boom')
    }



}

const feedProcessor = (feed, allFollowing) => {

    _following = []

    feed.edges.forEach(node => {
        node = node.node;
        if (!node.is_private) {
            _following.push({
                'id': node.id,
                'username': node.username,
                'node': full_name
            })
        }
    })

    allFollowing = allFollowing.concat(_following)

    return allFollowing;

}

const generateLink = (Session, after = null, first = 24) => {

    let variables;


    if (after) {
        variables = {
            "id": Session._userId,
            "include_reel": true,
            "fetch_mutual": false,
            "first": first,
            "after": after,
        }
    } else {
        variables = {
            "id": Session._userId,
            "include_reel": true,
            "fetch_mutual": false,
            "first": first,
        }
    }

    params = querystring.stringify({
        query_hash: Session._following_query_id,
        variables: JSON.stringify(variables)
    });

    url = `${Session._baseUrl}/graphql/query/?${params}`


    console.log(url);

    return url


}