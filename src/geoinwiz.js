var geoinvmodel = require('app/geoinvmodel');

var geoinwiz = module.exports;

geoinwiz.getUserNotifications = function (request, response, next) {
	geoinvmodel.getUserNotifications(request.params.userid)
		.then(function(data) {
			response.json(data);
		})
		.error(function(err) {
			response.status(500).json(err);
		});
};

geoinwiz.getNotificationDetails = function (request, response, next) {
	geoinvmodel.getNotificationDetails(request.params.userid, request.params.notificationid,
			request.query.radius, request.query.lat, request.query.lng)
			.then(function(data) {
				response.json(data);
			})
			.catch(function(err) {
				console.dir(err);
				response.status(500).json(err);
			});
};

geoinwiz.getDevicesByProximity = function (request, response, next) {
	console.dir(geoinvmodel);
	geoinvmodel.getDevicesByProximity(request.query.radius, request.query.lat, request.query.lng)
			.then(function(data) {
				response.json(data);
			})
			.catch(function(err) {
				response.status(500).json(err);
			});
};

geoinwiz.updateDeviceStatus = function (request, response, next) {
	geoinvmodel.updateDeviceStatus(request.params.userid, request.params.deviceid)
	.then(function(data) {
		response.json(data);
	})
	.catch(function(err) {
		response.status(500).json(err);
	});
};

geoinwiz.markNotificationAsRead = function(request, response, next) {
	if (!request.body.read) next();
	else {
		geoinvmodel.markNotificationAsRead(request.params.userid, request.params.notificationid)
		.then(function(data) {
			response.json(data);
		})
		.catch(function(err) {
			response.status(500).json(err);
		});
	}
};

geoinwiz.updateNotificationStatus = function (request, response, next) {
	if (!request.body.status) next();
	else {
		geoinvmodel.updateNotificationStatus(request.params.userid, request.params.notificationid, request.body.status)
		.then(function(data) {
			response.json(data);
		})
		.catch(function(err) {
			response.status(500).json(err);
		});
	}
};

