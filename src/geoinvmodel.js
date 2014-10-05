var appConfig = require('app/config');
var mongoClient = require('mongodb').MongoClient;
var messenger = require('messenger');
var Promise = require('bluebird');

var mongoConfig = appConfig.mongo;
var appName = appConfig.appName;

var db;
var collectionName = appName;

var geoInvModel = module.exports;

/**
 * Returns a promise that gets all notifications for
 * this user.
 */
geoInvModel.getUserNotifications = function(userId) {
	var get = function(resolve, reject) {
		var notifications = [
		{
			notificationid: 1,
			type: 'upgrade',
			description: 'Upgrade device notification',
			devicecount: 20,
			sla: 48, //This is in hours
			read: true
		},
		{
			notificationid: 2,
			type: 'upgrade',
			description: 'Upgrade device notification',
			devicecount: 9,
			sla: 96, //This is in hours
			read: false
		},
		{
			notificationid: 3,
			type: 'faulty',
			description: 'Upgrade device notification',
			devicecount: 2,
			sla: 4, //This is in hours
			read: false
		}
		];
		userId? resolve(notifications): reject('No user id given');
	};
	return new Promise(get);
};

geoInvModel.getNotificationDetails = function(userId, notificationId, deviceId) {
	return null;
};

geoInvModel.updateNotification = function(userId, notificationId) {
	return null;
};

geoInvModel.updateDevice = function(userId, notificationId, deviceId) {
	return null;
};

//private methods
//Connect to the db
mongoClient.connect(mongoConfig.url, function(err, database) {
	if (err) throw err;
	db = database;
	messenger.emit(appName + '.dbConnected');
});

//Close the db connection when the app exits
messenger.once(appName + '.exit', function() {
	db.close();
	messenger.emit(appName + '.dbExit');
});
