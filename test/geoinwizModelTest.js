var chai = require('chai');
var expect = chai.expect;

describe('The geo inv model', function() {
	var geoInvModel = require('app/geoinvmodel');

	it('returns an array of notifications for a user', function(done) {
		geoInvModel.getUserNotifications('1').then(
			function(notifications) {
				expect(notifications).to.no.be.null;
				expect(notifications[0]).to.have.property('notificationid');
				done();
			}
		);

	});
	it('returns details of notification', function() {
		return geoInvModel.getNotificationDetails('1', '1').should.eventually.have.property('deviceid');
	});
	xit('updates notification read status', function() {
		return geoInvModel.updateNotification('1', '1').should.eventually.have.property('length');
	});
	xit('updates device status', function() {
		return geoInvModel.updateDevice('1', '1', '1').should.eventually.have.property('length');
	});
});
