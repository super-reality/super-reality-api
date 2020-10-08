const app = require('../app')
app.listen(3002)
const chai = require('chai')
const request = require('supertest');
const mongoose = require("mongoose");
mongoose.Promise = Promise;
const database = mongoose.connection;
var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDE3OTMyMjksImV4cCI6MTYwMjM5ODAyOSwiYXVkIjoib3BlbndvcmxkLXNlcnZlciIsImlzcyI6ImNvbS5nYW1lZ2VuLm9wZW53b3JsZC1zZXJ2ZXIiLCJzdWIiOiI1ZjZkMGUyZmU3NjkxZDg1NDhhNjJhN2EifQ.JxTQ1KfEqoENJKVkbgFb-QHYwQD3qGG-00ebKXdiMT0"

var expect = chai.expect;
describe('API Tests', function () {

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
    });

    afterAll(async () => {
        await mongoose.disconnect()
    })

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

    describe('## Step ', function () {
        it('should create a step', function (done) {
            request(app).post('/api/v1/step/create').send({ name: "testt" }).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(400);
                    done();
                }
            });
        });
    });

});


