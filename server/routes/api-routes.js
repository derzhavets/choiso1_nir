'use strict';

var users = require('../controllers/userCtrl'),
    alternatives = require('../controllers/alternativeCtrl'),
    recents = require('../controllers/recentsCtrl'),
    general = require('../controllers/generalCtrl'),
    express = require('express'),
    router = express.Router();


module.exports = function(passport) {

    // middleware
    //router.param('usersId', users.findById);


    // users 
    router.route('/start')
        .get(general.start);
    
    // users 
    router.route('/users/me')
        .get(isLoggedIn, users.me);

    router.route('/users/:usersId')
        .put(isLoggedIn, users.update);
        //.delete(isLoggedIn, users.delete);

    // alternatives 
    router.route('/alternatives')
        .post(isLoggedIn, alternatives.create);

    router.route('/alternatives/:id')
        .put(isLoggedIn, alternatives.update)
        .delete(isLoggedIn, alternatives.delete);

    // recents 
    router.route('/contacts/add-recent/:id')
        .post(isLoggedIn, recents.add);

    
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
