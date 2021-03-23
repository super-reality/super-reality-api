const app = require('../../app')
const chai = require('chai')
const request = require('supertest');
const mongoose = require("mongoose");
mongoose.Promise = Promise;
const database = mongoose.connection;
const expect = chai.expect;

const createcategoryPayload = {
    "name": "sample category"
}
const loginPayload =
    {
        "username": "sifantest@gmail.com",
        "password": "sifan059"
    }
let categoryId = null
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
    describe('## Category ', function () {
        it('should create a category', function (done) {
            request(app).post('/api/v1/category/create').send(createcategoryPayload).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    categoryId = res.body._id
                    expect(res.statusCode).to.equal(201);
                    done();
                }
            });
        });
    });
    describe('# Category', function () {
        it('should get all categorys', function (done) {
            request(app).get('/api/v1/category').set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });
    describe('# Cateogory', function () {
        it('should get a category by its id ', function (done) {
            request(app).get('/api/v1/category/' + categoryId).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });
    describe('# categorys', function () {
        it('should delete the category that was created', function (done) {
            request(app).delete('/api/v1/category/' + categoryId).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });
});



