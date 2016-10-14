'use strict';

var users = require('../controllers/userCtrl'),
    alternatives = require('../controllers/alternativeCtrl'),
    mirror = require('../controllers/mirror'),
    traits = require('../controllers/traitsCtrl'),
    recents = require('../controllers/recentsCtrl'),
    general = require('../controllers/generalCtrl'),
    requests = require('../controllers/requestsCtrl'),
    requirements = require('../controllers/requirementsCtrl'),
    express = require('express'),
    multer  = require('multer'),
    router = express.Router();

var storage = multer.memoryStorage()
var upload = multer({ storage: storage })

module.exports = function(passport) {

    // middleware
    //router.param('usersId', users.findById);


    // users 
    router.route('/start')
        .get(general.start);
    
    // users 
    router.route('/users/me')
        .get(isLoggedIn, users.me)
        .put(isLoggedIn, users.update);

    router.route('/users/me/update-image')
        .put(isLoggedIn, upload.single('avatar'), users.updateImage);

    // alternatives 
    router.route('/alternatives')
        .post(isLoggedIn, alternatives.create);

    router.route('/alternatives/:id')
        .put(isLoggedIn, alternatives.update)
        .delete(isLoggedIn, alternatives.delete);

    // requirements 
    router.route('/alternatives/:id/requirements')
        .post(isLoggedIn, requirements.create);

    router.route('/alternatives/:id/requirements/:reqId')
        .delete(isLoggedIn, requirements.delete);

    router.route('/alternatives/:id/requirements/:reqId/scores/:score')
        .put(isLoggedIn, requirements.setScore)
    
    // mirror lists 
    router.route('/mirror')
        .post(isLoggedIn, mirror.create);

    router.route('/mirror/:id')
        .put(isLoggedIn, mirror.update)
        .delete(isLoggedIn, mirror.delete);
    // attributes 
    router.route('/traits/:id/attributes')
        .post(isLoggedIn, traits.create);
  
     router.route('/traits/:id/attributes/:reqId')
        .delete(isLoggedIn, traits.delete);

    router.route('/traits/:id/attributes/:reqId/scores/:score')
        .put(isLoggedIn, traits.setScore)
  
    
    // recents 
    router.route('/contacts/add-recent/:id')
        .post(isLoggedIn, recents.add);

    // requests 
    router.route('/requests')
        .get(isLoggedIn, requests.list)
        .post(isLoggedIn, requests.create);

    router.route('/requests/:section')
        .put(isLoggedIn, requests.update)
        .get(isLoggedIn, requests.listBySection);

    
    // login
    router.route('/login')
        .post(passport.authenticate('local-login', {failureFlash : true}), function(req, res){
        
        res.json(req.user);
    });

    // logout
    router.get('/logout', function(req, res) {
        req.logout();
        res.sendStatus(200);
    });


    // 404
    router.route('*').get(function(req, res){
        res.sendStatus(404);
    });

    return router;
};

// export the router
//module.exports = router;


// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.sendStatus(403);
}
