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

geoinwiz.updateDevice = function (request, response, next) {
	geoinvmodel.updateDevice(request.userid, request.params.notificationid, request.params.deviceid);
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
		getinvmodel.updateNotificationStatus(request.params.userid, request.params.notificationid, request.body.status);
		.then(function(data) {
			response.json(data);
		})
		.catch(function(err) {
			response.status(500).json(err);
		});
	}
};

