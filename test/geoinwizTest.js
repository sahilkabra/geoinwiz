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
			.end(function(err, response) {
				if (err) done(err);
				expect(response.status).to.equal(200);
				expect(response.body).to.be.defined;
				expect(response.body).to.have.property('devices');
				expect(response.body.devices[0]).to.have.property('type');
				done();
			}
		);
	});
	it('marks notification as read', function(done) {
		geoInvRESTApi.get('/notifications/1?read=true')
		.end(function(err, response) {
			if (err)  done(err);
			else {
				expect(response.status).to.equal(200);
				expect(response.body).to.be.defined;
				expect(response.body).to.have.property('devices');
				expect(response.body.devices[0]).to.have.property('type');
				done();
			}
		});
	});
	it('updates device status', function(done) {
		geoInvRESTApi.get('/notifications/1/device/1?status=complete')
		.expect(200)
		.end(function(err, response) {
			expect(response.status).to.equal(200);
			if (err)  done(err);
			else {
				expect(response.body.n).to.be.defined;
				expect(response.body.n).to.equal(1);
				done();
			}
		});
	});
	it('returns details of notification when lat and lon are passed', function(done) {
		geoInvRESTApi.get('/notifications/1?radius=1000&lat=33.67&lng=-84.30')
			.expect('Content-Type', /json/)
			.end(function(err, response) {
				if (err) done(err);
				else {
					expect(response.status).to.equal(200);
					expect(response.body).to.be.defined;
					expect(response.body).to.have.property('devices');
					expect(response.body.devices[0]).to.have.property('type');
					done();
				}
			}
		);
	});
	it('updates notification status', function(done) {
		geoInvRESTApi.get('/notifications/1?status=complete')
		.expect(200)
		.end(function(err, response) {
			if (err)  done(err);
			else {
				geoInvRESTApi.get('/notifications/1')
					.expect('Content-Type', /json/)
					.expect(200)
					.end(function(err, response) {
						if (err) done(err);
						else {
							expect(response.body).to.be.defined;
							expect(response.body).to.have.property('status', 'complete');
							done();
						}
					}
				);
			}
		});
	});
	it('returns devices by proximity', function(done) {
		geoInvRESTApi.get('/devices?radius=1000&lat=33.67&lng=-84.30')
			.expect('Content-Type', /json/)
			.end(function(err, response) {
				if (err) done(err);
				else {
					expect(response.status).to.equal(200);
					expect(response.body).to.be.defined;
					expect(response.body[0]).to.have.property('devices');
					expect(response.body[0].devices[0]).to.have.property('type');
					done();
				}
			}
		);
	});
});
