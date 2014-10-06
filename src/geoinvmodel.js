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
		db.collection('notifications', {strict: true},
			function(err, connection) {
				if (err) {
					reject(err);
				} else {
					var query = {
						"userid": parseInt(userId)
					};
					connection.find(query).toArray(function(err, notifications) {
						if (err) {
							reject(err);
						} else {
							resolve(notifications);
						}
					});
				}
			}
		);
	};
	return new Promise(get);
};

geoInvModel.getNotificationDetails = function(userId, notificationId, radius, lat, lon) {
	if (lat && lon) {
		return getDetailsByProximity(userId, notificationId, radius? radius: 100000, lat, lon);
	} else {
		return getDetailsForNotification(userId, notificationId);
	}
};

geoInvModel.updateNotification = function(userId, notificationId) {
	var get = function(resolve, reject) {
		db.collection('notifications', function(err, connection) {
			if (err) {
				reject(err);
			} else {
				var query = {
					"_id": notificationId,
					"userid": userId
				};
				connection.update(query, {$set: {"read": true}}, {multi: false}, function(err, count, status) {
					if (err) {
						reject(err);
					} else {
						resolve(status);
					}
				});
			}
		});
	};

	return new Promise(get);
};

geoInvModel.updateDevice = function(userId, notificationId, deviceId) {
	return null;
};

//private methods
var getDetailsForNotification = function(userId, notificationId) {
	var get = function(resolve, reject) {
		db.collection('notifications', {strict: true},
			function(err, connection) {
				if (err) {
					reject(err);
				} else {
					var query = {
						"userid": parseInt(userId),
						"_id": parseInt(notificationId)
					};
					connection.find(query).toArray(function(err, notifications) {
						if (err) {
							reject(err);
						} else {
							resolve(notifications);
						}
					});
				}
			}
		);
	};
	return new Promise(get);
};

var getDetailsByProximity = function(userId, notificationid, radius, lat, lon) {
	var get = function(resolve, reject) {
		db.collection('notifications', {strict: true},
			function(err, connection) {
				if (err) {
					reject(err);
				} else {
					var nearQuery = {
						"devices.location": {
							$near: {
								$geometry: {
									type: 'Point',
									coordinates: [parseFloat(lon), parseFloat(lat)]
								},
								$maxDistance: parseFloat(radius)
							}
						}
					};
					connection.find(nearQuery).toArray(function(err, docs) {
						console.dir(nearQuery);
						if (err) {
							reject(err);
						} else {
							resolve(docs);
						}
					});
				}
			}
		);
	};
	return new Promise(get);
};

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
