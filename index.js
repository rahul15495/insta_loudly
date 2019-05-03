const express = require("express"),
    http = require("http");

const profile = require('./controller/profile');


let app = express();

const port = 8000;

app.get('/profile/:id', (req, res) => {

    profile.getProfileData(req.params.id)
        .then(o => {
            res.json({
                status: true,
                data: o
            });
        })
        .catch(err=>{
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