var Client = require('instagram-private-api').V1;
var device = new Client.Device('rahul');
var storage = new Client.CookieFileStorage(__dirname + '/cookies/test.json');


var feed, accountId;

var userMetaData = [];
var posts = [];

// And go for login
Client.Session.create(device, storage, 'sex.n.city', 'raipur')
    .then(session => {
        return Promise.all([session, Client.Account.searchForUser(session, '_ishwari_')])
    })
    .spread((session, account) => {

        userMetaData = account._params

        accountId = account._params.id;

        feed = new Client.Feed.UserMedia(session, accountId);

        return Promise.resolve(1);

    })
    .then(_ => {
        return Promise.resolve(feed.get())
    })
    .then((result) => {
        // posts.push(result._params)

        // console.log(`feed.isMoreAvailable() : ${feed.isMoreAvailable()}`);

        feed = result.map(each => {

            x = each._params;

            return {
                    'takenAt': x.takenAt,
                    'commentCount': x.commentCount,
                    'caption': x.caption,
                    'likeCount': x.likeCount,
                    'webLink': x.webLink,

                    'images': x.images.map((each) => {
                        return each.url;
                    }),
                }
        })



        console.log(feed)
    })  
