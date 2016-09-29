'use strict';

var config = require('../../config');


// send email for request
exports.sendRequest = function(request){
 console.log('email sent to', request.to);
};