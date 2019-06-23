var querystring = require('querystring');

module.exports.getFollowing = async(Session) => {

    let following = []

    let link = generateLink(Session)

    let initial_link = `/${Session._userHandle}/followers/`

    let total_following = 0;

    try {

        Session.referer = Session._baseUrl + initial_link

        //console.log(Session._referer)

        // console.log(Session._client.defaults)

        let response = await Session._client.get(link);

        // console.log(JSON.stringify(response.data));

        let feed = response.data.data.user.edge_follow;

        total_following = feed.count;
        let has_next_page = feed.page_info.has_next_page;
        let end_cursor = feed.page_info.end_cursor;

        following = feedProcessor(feed, following);

        while (has_next_page && following.length < 100) {

            link = generateLink(Session, end_cursor);

            console.log(link)

            response = await Session._client.get(link);


            feed = response.data.data.user.edge_follow;

            total_following = feed.count;
            has_next_page = feed.page_info.has_next_page;
            end_cursor = feed.page_info.end_cursor;

            following = feedProcessor(feed, following);

        }


    } catch (err) {
        console.log(err)
    }

    return {
        'total_following': total_following,
        'total_extracted': following.length,
        'following': following
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