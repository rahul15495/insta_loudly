const express = require("express"),
    http = require("http"),
    cookieParser = require('cookie-parser'),
    session = require('./core/session'),
    morgan = require('morgan');

const profile = require('./controller/profile');


let app = express();

app.use(cookieParser())

const port = 8000;

var FSession = new session.Session('');


// app.use(morgan(
//     ':remote-addr :method :url HTTP/:http-version :status :res[content-length] - :response-time ms', {
//         skip: function(req, res) {
//             return res.statusCode < 400
//         },
//         stream: process.stderr
//     }));

// app.use(morgan(
//     ':remote-add :method :url HTTP/:http-version :status :res[content-length] - :response-time ms', {
//         skip: function(req, res) {
//             return res.statusCode >= 400
//         },
//         stream: process.stdout
//     }));


app.get('/profile/:id', (req, res) => {

    let userHandle = req.params.id;

    console.log('requesting profile for :' + userHandle);

    var Session = new session.Session(userHandle);

    profile.getProfileData(Session)
        .then(o => {
            res.json({
                status: true,
                data: o
            });
        })
        .catch(err => {
            console.error(err);

            res.json({
                status: false,
                error: "incorrect username"
            })
        })
})

app.get('/following/:id', (req, res) => {

    let userHandle = req.params.id;

    FSession.userHandle = userHandle;

    console.log('requesting following data for :' + userHandle)

    Promise.resolve()
        .then(_ => {
            profile.extractFollowing(FSession)
                .then(o => {
                    res.json({
                        status: true,
                        data: o
                    });
                })
                .catch(err => {
                    console.error(err);

                    res.json({
                        status: false,
                        error: "incorrect username"
                    })
                })
        })


})

FSession.login().then(_ => {
    http.createServer(app).listen(port, () => {
        console.log(`server listening to ${port}`);
    });
})