'use strict';

var express = require('express'),
    router = express.Router();

// angular admin panel
router.route('*').get(function (req, res) {
  
  
  var locals = {
      user: req.user ? req.user : ''
  };
  
  res.render('admin-index', locals);
    
});

// export the router
module.exports = router;
