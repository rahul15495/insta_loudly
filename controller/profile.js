const Client = require('instagram-private-api').V1;
const underscore = require('lodash');

const config = require('../config.js').config;

var device = new Client.Device('rahul');
var storage = new Client.CookieFileStorage(config.cookiePath);



let accountId;
var userMetaData = [];
var numPosts =0

// And go for login
module.exports.getProfileData = (userHandle) => {
    return Client.Session.create(device, storage, config.username, config.password)
        .then(session => {
            return Promise.all([session, Client.Account.searchForUser(session, userHandle)])
        })
        .spread((session, account) => {

            userMetaData = account._params

            accountId = account._params.id;

            var feed = new Client.Feed.UserMedia(session, accountId);

            return getPosts(feed);

        })
        .then(posts => {

            return Promise.resolve({
                "userMetaData": userMetaData,
                "posts": posts
            });
        })


}

let getPosts = (feed) => {

    var posts = []

    return feed.get()
        .then(setPost)
        .then(_posts => {

            posts.push(_posts);

        })
        .then(_ => {

            while (feed.isMoreAvailable() && numPosts < config.maxNumPost) {

                feed.get()
                    .then(_posts => {

                        posts.push(_posts);

                    })
            }

            return Promise.all(underscore.flatten(posts));
        });

}

let setPost = (result) => {

    return result.map(each => {
        
        numPosts ++ ;

        x = each._params;

        return {
            'id': x.id,
            'takenAt': x.takenAt,
            'commentCount': x.commentCount,
            'caption': x.caption,
            'likeCount': x.likeCount,
            'webLink': x.webLink,

            'images': x.images.map((each) => {
                return each.url;
            }),
        };
    });

}