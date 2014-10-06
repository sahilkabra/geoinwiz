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
				expect(response.body).to.be.defined;
				expect(response.body[0]).to.have.property('userid');
				done();
			}
		);
	});
	it('returns all details of notification when lat and lon are not passed', function(done) {
		geoInvRESTApi.get('/notifications/1')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, response) {
				if (err) done(err);
				expect(response.body).to.be.defined;
				expect(response.body[0]).to.have.property('devices');
				expect(response.body[0].devices[0]).to.have.property('type');
				done();
			}
		);
	});
	it('updates notification read status', function(done) {
		getInvRestApi.post('/notifications/1')
		.send({'read': 'true'})
		.expect(200)
		.end(function(err, response) {
			if (err) done(err);
			done();
		});
	});
	xit('updates device status', function() {
	});
	it('returns details of notification when lat and lon are passed', function(done) {
		geoInvRESTApi.get('/notifications/1?radius=1000&lat=40.76&lng=-73.97')
			.expect('Content-Type', /json/)
			.end(function(err, response) {
				if (err) done(err);
				expect(response.status).to.equal(200);
				expect(response.body).to.be.defined;
				expect(response.body[0]).to.have.property('devices');
				expect(response.body[0].devices[0]).to.have.property('type');
				done();
			}
		);
	});
});
