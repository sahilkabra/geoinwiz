var appConfig = require('app/config');
var mongoClient = require('mongodb').MongoClient;
var messenger = require('messenger');
var Promise = require('bluebird');

var mongoConfig = appConfig.mongo;
var appName = appConfig.appName;

var db;
var notificationsCollection = 'notifications';
var deviceCollection = 'devices';

var geoInvModel = module.exports;

/**
 * Returns a promise that gets all notifications for
 * this user.
 */
geoInvModel.getUserNotifications = function(userId) {
	var get = function(resolve, reject) {
		db.collection(notificationsCollection, {strict: true},
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
	return getDetailsForNotification(userId, notificationId, radius? radius: 100000, lat, lon);
};

geoInvModel.markNotificationAsRead = function(userId, notificationId) {
	var get = function(resolve, reject) {
		db.collection(notificationsCollection, function(err, connection) {
			if (err) {
				reject(err);
			} else {
				var query = {
					"_id": parseInt(notificationId),
					"userid": parseInt(userId)
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

geoInvModel.updateNotificationStatus = function(userId, notificationId) {
	var get = function(resolve, reject) {
		db.collection(notificationsCollection, function(err, connection) {
			if (err) {
				reject(err);
			} else {
				var query = {
					"_id": parseInt(notificationId),
					"userid": parseInt(userId)
				};
				connection.update(query, {$set: {"status": 'complete'}}, {multi: false}, function(err, count, status) {
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

geoInvModel.updateDeviceStatus = function(userId, deviceId) {
	var get = function(resolve, reject) {
		db.collection(deviceCollection, function(err, connection) {
			if (err) {
				reject(err);
			} else {
				var query = {
					"_id": parseInt(deviceId),
				};
				connection.update(query, {$set: {'status': 'complete'}}, {multi: false}, function(err, count, status) {
					if (err || !deviceId) {
						reject(err);
					} else {
						count === 1? resolve(status): reject('No device updated');
					}
				});
			}
		});
	};
	return new Promise(get);
};

geoInvModel.getAllDeviceDetails = function(userId, radius, lat, lon) {
	return getNotificationDetailsByProximity(userId, undefined, radius? radius: 100000, lat, lon);
};



//private methods
var getDetailsForNotification = function(userId, notificationId, radius, lat, lon) {
	var get = function(resolve, reject) {
		db.collection(notificationsCollection, {strict: true},
			function(err, connection) {
				if (err) {
					reject(err);
				} else {
					var query = {
						"userid": parseInt(userId),
						"_id": parseInt(notificationId)
					};
					connection.findOne(query, function(err, notification) {
						if (err) {
							reject(err);
						} else {
							getDevicesForNotification(radius, lat, lon, notification)
							.then(function(devices) {
								notification["devices"] = devices;
								resolve(notification);
							})
							.catch(function(err) {
								reject(err);
							});
						}
					});
				}
			}
		);
	};
	return new Promise(get);
};

var getDevicesByProximity = function(radius, lat, lon, notification) {
	var get = function(resolve, reject) {
		db.collection(deviceCollection, {strict: true},
			function(err, connection) {
				if (err) {
					reject(err);
				} else {
					var query = {
						"location": {
							$near: {
								$geometry: {
									type: 'Point',
									coordinates: [parseFloat(lon), parseFloat(lat)]
								},
								$maxDistance: parseFloat(radius)
							}
						}
					};
					if (notification) {
						query['_id'] = {'$in' : notification.devices};
					}
					console.dir(query);
					connection.find(query).toArray(function(err, devices) {
						if (err) reject(err);
						else resolve(devices);
					});
				}
			}
		);
	};
	return new Promise(get);
};

var getDevicesForNotification = function(radius, lat, lon, notification) {
	if (lat && lon) {
		return getDevicesByProximity(radius, lat, lon, notification);
	}
	var get = function(resolve, reject) {
		db.collection(deviceCollection, {strict: true},
			function(err, connection) {
				if (err) {
					reject(err);
				} else {
					var query = {
						'_id': {$in: notification.devices}
					};
					connection.find(query).toArray(function(err, devices) {
						if (err) reject(err);
						else resolve(devices);
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

geoInvModel.getDevicesByProximity = getDevicesByProximity;
