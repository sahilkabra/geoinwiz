var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var should = chai.should();

chai.use(chaiAsPromised);

describe('The geo inv model', function() {
	var geoInvModel = require('app/geoinvmodel');

	it('returns an array of notifications for a user', function() {
		return geoInvModel.getUserNotifications('1').should.eventually.have.property('length');
	});
	it('returns details of notification', function() {
		return geoInvModel.getNotificationDetails('1', '1', '1').should.eventually.have.property('deviceid');
	});
	xit('updates notification read status', function() {
		return geoInvModel.updateNotification('1', '1').should.eventually.have.property('length');
	});
	xit('updates device status', function() {
		return geoInvModel.updateDevice('1', '1', '1').should.eventually.have.property('length');
	});
});
