const profile = require('./controller/profile') ;

profile.getProfileData('_ishwari_').then(o=>{
    console.log(JSON.stringify(o))
});