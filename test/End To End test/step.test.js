const app = require('../../app')
const chai = require('chai')
const request = require('supertest');
const mongoose = require("mongoose");
mongoose.Promise = Promise;
const database = mongoose.connection;
const expect = chai.expect;

const createStepPayload = {
    "name": "testing automated token genearation and creating step "
}
const loginPayload =
    {
        "username": "sifantest@gmail.com",
        "password": "sifan059"
    }
let stepId = null
let token = null

describe('API Tests', function () {

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
    });

    afterAll(async () => {
        await mongoose.disconnect()
    })
    describe('## Login to generate a token ', function () {
        it('should create a token', function (done) {
            request(app).post('/api/v1/auth/signin').send(loginPayload).end(function (err, res) {
                if (res) {
                    token = res.body.token
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });
    describe('## Steps ', function () {
        it('should create a step', function (done) {
            request(app).post('/api/v1/step/create').send(createStepPayload).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    stepId = res.body.steps._id
                    expect(res.statusCode).to.equal(201);
                    done();
                }
            });
        });
    });
    describe('# Steps', function () {
        it('should get all steps', function (done) {
            request(app).get('/api/v1/step').set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });
    describe('# Steps', function () {
        it('should get a step by its id ', function (done) {
            request(app).get('/api/v1/step/' + stepId).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });

       describe('# Steps', function () {
        it('should get items of a step ', function (done) {
            request(app).get('/api/v1/step/items/' + stepId).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });
    describe('# Steps', function () {
        it('should delete the step that was created', function (done) {
            request(app).delete('/api/v1/step/' + stepId).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });
});



