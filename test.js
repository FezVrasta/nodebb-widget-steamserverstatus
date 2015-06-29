/* globals console, require, Buffer */

var ssq = require('ssq');

var PORT = 27016;
var HOST = 'playark.it';

ssq.info(HOST, PORT, function(err, data) {
   console.log(data.servername);
});
