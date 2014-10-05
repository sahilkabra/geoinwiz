var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var expect = chai.expect;
var supertest = require('supertest');

chai.use(chaiAsPromised);

describe('The geo inv REST API', function() {
	var geoInvRESTApi = supertest('http://localhost:11001/geoinwiz/1');

	it('returns an array of notifications for a user', function(done) {
		geoInvRESTApi.get('/notifications')
			.expect('Content-Type', /json/)
			.end(function(err, response) {
				if (err) done(err);
				expect(response.body).to.have.property('length');
				done();
			});
	});
	xit('returns details of notification', function() {
	});
	xit('updates notification read status', function() {
	});
	xit('updates device status', function() {
	});
});
