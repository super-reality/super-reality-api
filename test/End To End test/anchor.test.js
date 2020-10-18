const app = require('../../app')
const chai = require('chai')
const request = require('supertest');
const mongoose = require("mongoose");
mongoose.Promise = Promise;
const database = mongoose.connection;
const expect = chai.expect;


const createAnchorPayload = {
    "name": "Test anchor",
        "type": "crop",
}

const updateAnchorPayload ={
        "templates": [
            "C:\\Users\\Manuh\\AppData\\Roaming\\super-reality-client\\1602775426216.png"
        ],
        "anchor_id": "5f88698354821859fd1fc89f",
        "name": "Test anchor",
        "type": "",
        "anchorFunction": "and",
        "cvMatchValue": 200,
        "cvCanvas": 200,
        "cvDelay": 200,
        "cvGrayscale": false,
        "cvApplyThreshold": false
      }
const loginPayload =
    {
        "username": "sifantest@gmail.com",
        "password": "sifan059"
    }

let anchorId = null
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


    describe('## Anchors ', function () {
        it('should create a anchor', function (done) {
            request(app).post('/api/v1/anchor/create').send(createAnchorPayload).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    anchorId = res.body.anchor._id
                    updateAnchorPayload.anchor = anchorId
                    expect(res.statusCode).to.equal(201);
                    done();
                }
            });
        });
    });

    describe('# Anchors', function () {
        it('should get a Anchor by its id ', function (done) {
            request(app).get('/api/v1/anchor/' + anchorId).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });

    describe('# Anchors', function () {
        it('should update the anchor that was created', function (done) {
            request(app).put('/api/v1/anchor/').send(updateAnchorPayload).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });
    describe('# Chapters', function () {
        it('should delete the anchor that was created', function (done) {
            request(app).delete('/api/v1/anchor/' + anchorId).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });


});



