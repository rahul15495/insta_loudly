const express = require("express"),
    http = require("http"),
    cookieParser = require('cookie-parser'),
    session = require('./core/session');

const profile = require('./controller/profile');


let app = express();

app.use(cookieParser())

const port = 8000;

app.get('/profile/:id', (req, res) => {

    let userHandle = req.params.id;

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


http.createServer(app).listen(port, () => {
    console.log(`server listening to ${port}`);
});