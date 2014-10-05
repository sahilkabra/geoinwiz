var geoinvmodel = require('app/geoinvmodel');

var geoinwiz = module.exports;

geoinwiz.getUserNotifications = function (request, response, next) {
	geoinvmodel.getUserNotifications(request.params.userid)
		.then(function(data) {
			response.json(data);
		})
		.error(function(err) {
			response.error(err);
		});
};

geoinwiz.getNotificationDetails = function (request, response, next) {
	getinvmodel.getNotificationDetails(request.params.userid, request.params.notificationid);
};

geoinwiz.updateDevice = function (request, response, next) {
	getinvmodel.updateDevice(request.userid, request.params.notificationid, request.params.deviceid);
};

geoinwiz.updateNotification = function (request, response, next) {
	getinvmodel.updateNotification(request.params.userid, request.params.notificationid);
};

