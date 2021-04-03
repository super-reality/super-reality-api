const app = require('../../app')
const chai = require('chai')
const request = require('supertest');
const mongoose = require("mongoose");
mongoose.Promise = Promise;
const database = mongoose.connection;
const expect = chai.expect;

const createVibePayload = {
    "title": "test vibe",
    "emoji":"test ulr"
}
const loginPayload =
    {
        "username": "sifantest@gmail.com",
        "password": "sifan059"
    }
let vibeId = null
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
    describe('## Vibes ', function () {
        it('should create a vibe', function (done) {
            request(app).post('/api/v1/vibe/create').send(createVibePayload).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    vibeId = res.body._id
                    expect(res.statusCode).to.equal(201);
                    done();
                }
            });
        });
    });
    describe('# Vibes', function () {
        it('should get all vibes', function (done) {
            request(app).get('/api/v1/vibe').set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });
    describe('# Vibes', function () {
        it('should get a vibe by its id ', function (done) {
            request(app).get('/api/v1/vibe/' + vibeId).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });
});



