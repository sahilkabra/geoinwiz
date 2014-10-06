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
		geoInvRESTApi.post('/notifications/1')
		.send({'read': 'true'})
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
							expect(response.body[0]).to.have.property('read', true);
							done();
						}
					}
				);
			}
		});
	});
	it('updates device status', function() {
		geoInvRESTApi.post('/notifications/1/device/1')
		.send({'status': 'complete'})
		.expect(200)
		.end(function(err, response) {
			expect(response.status(200));
			if (err)  done(err);
			else {
				geoInvRESTApi.get('/notifications/1/device/1')
					.expect('Content-Type', /json/)
					.expect(200)
					.end(function(err, response) {
						var deviceIndex = 0;
						if (err) done(err);
						else {
							expect(response.body).to.be.defined;
							for (deviceIndex = 0; deviceIndex < response.body.length; deviceIndex++) {
								if(response.body[deviceIndex]['_id'] === 1) {
									expect(response.body[deviceIndex]).to.have.property('status', 'complete');
									done();
								}
							}
						}
					}
				);
			}
		});
	});
	it('returns details of notification when lat and lon are passed', function(done) {
		geoInvRESTApi.get('/notifications/1?radius=1000&lat=40.76&lng=-73.97')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, response) {
				if (err) done(err);
				else {
					expect(response.body).to.be.defined;
					expect(response.body[0]).to.have.property('devices');
					expect(response.body[0].devices[0]).to.have.property('type');
					done();
				}
			}
		);
	});
	it('updates notification status', function() {
		geoInvRESTApi.post('/notifications/1')
		.send({'status': 'complete'})
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
});
