var querystring = require('querystring');

module.exports.getFollowing = async(Session) => {

    let following = []

    let link = generateLink(Session)

    let initial_link = `/${Session._userHandle}/followers/`

    try {

        Session.referer = Session._baseUrl + initial_link

        //console.log(Session._referer)

        // console.log(Session._client.defaults)

        let response = await Session._client.get(link);

        // console.log(JSON.stringify(response.data));

        let feed = response.data.data.user.edge_follow;

        let total_following = feed.count;
        let has_next_page = feed.page_info.has_next_page;
        let end_cursor = feed.page_info.end_cursor;

        following = feedProcessor(feed, following);
    } catch (err) {
        console.log(err)
    }

    return following
}

const feedProcessor = (feed, allFollowing) => {

    _following = []

    feed.edges.forEach(node => {
        node = node.node;
        if (!node.is_private) {
            _following.push({
                'id': node.id,
                'username': node.username,
                'full_name': node.full_name
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
            "fetch_mutual": true,
            "first": first,
        }
    }

    params = querystring.stringify({
        query_hash: Session._following_query_id,
        variables: JSON.stringify(variables)
    });

    url = `${Session._baseUrl}/graphql/query/?${params}`

    return url


}