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
	var self = this;
	var get = function(resolve, reject) {
		db.collection(notificationsCollection, function(err, connection) {
			if (err) {
				reject(err);
			} else {
				var query = {
					"_id": parseInt(notificationId),
					"userid": parseInt(userId)
				};
				console.log('mark as read');
				connection.update(query, {$set: {"read": true}}, {multi: false}, function(err, count, status) {
					if (err) {
						reject(err);
					} else {
						resolve(self.getNotificationDetails(userId, notificationId));
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

geoInvModel.getNotificationsByProximity = function(userId, radius, lat, lon) {
	var get = function(resolve, reject) {
		getDevicesByProximity(radius, lat, lon)
		.then(function(devices) {
			var deviceIndex = 0;
			var deviceId = [];
			for (deviceIndex = 0; deviceIndex < devices.length; deviceIndex++) {
				deviceId.push(devices[deviceIndex]['_id']);
			}
			getNotificationsByDeviceId(userId, deviceId).then(function(notifications) {
				var index = 0;
				var dIndex = 0;
				var nIndex = 0;
				var notification;
				//Iterated through notifications replacing device ids with device objects
				for (index = 0; index < notifications.length; index++) {
					notification = notifications[index];
					for (dIndex = 0; dIndex < devices.length; dIndex++) {
						nIndex = notification.devices.indexOf(devices[dIndex]['_id']);
						if (nIndex != -1) {
							notification.devices[nIndex] = devices[dIndex];
						}
					}
				}
				//iterate through notifications removing all elements that are only number
				for(index = 0; index < notifications.length; index++) {
					var newDevices = [];
					var oldDevices = notifications[index].devices;
					for(dIndex = 0; dIndex < oldDevices.length; dIndex++) {
						if (typeof oldDevices[dIndex]['_id'] != 'undefined') {
							newDevices.push(oldDevices[dIndex]);
						}
					}
					notifications[index].devices = newDevices.slice();
					newDevices.length = 0;
				}
				resolve(notifications);
			})
			.catch(function(err) {
				reject(err);
			});
		})
		.catch(function(err) {
			reject(err);
		});
	};
	return new Promise(get);
};

//private methods
var getNotificationsByDeviceId = function(userId, deviceIds) {
	var get = function(resolve, reject) {
		db.collection(notificationsCollection, {strict: true},
			function(err, connection) {
				if (err) {
					reject(err);
				} else {
					var query = {
						"userid": parseInt(userId),
						'devices': {'$in': deviceIds}
					};
					connection.find(query).toArray(function(err, notifications) {
						if (err) reject(err);
						else resolve(notifications);
					});
				}
			}
		);
	};
	return new Promise(get);
};

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
