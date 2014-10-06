//app/app

/**
 * The main app module. Attaches to the port configured after the application has connected to the database
 */
var express = require("express");
var morgan = require('morgan');
var router = require('routes/router');
var config = require('app/config');
var app = express();
var messenger = require('messenger');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(morgan('short'));
app.use(router);
//app.use(error);
messenger.on(config.appName + '.dbConnected', function() {
		app.listen(config.express.port);
		console.log('Service (%d) started on port %d', config.pid, config.express.port);
});

messenger.once(config.appName + '.exit', function() {
		console.log('Bye');
		process.nextTick(function() {process.exit()});
});
