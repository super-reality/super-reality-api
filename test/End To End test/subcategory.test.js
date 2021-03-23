const app = require('../../app')
const chai = require('chai')
const request = require('supertest');
const mongoose = require("mongoose");
mongoose.Promise = Promise;
const database = mongoose.connection;
const expect = chai.expect;

const createsubcategoryPayload = {
    "name": "testing automated token genearation and creating subcategory "
}
const loginPayload =
    {
        "username": "sifantest@gmail.com",
        "password": "sifan059"
    }
let subcategoryId = null
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
    describe('## Sub category ', function () {
        it('should create a subcategory', function (done) {
            request(app).post('/api/v1/subcategory/create').send(createsubcategoryPayload).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    subcategoryId = res.body._id
                    expect(res.statusCode).to.equal(201);
                    done();
                }
            });
        });
    });
    describe('# Sub category', function () {
        it('should get all sub categories', function (done) {
            request(app).get('/api/v1/subcategory').set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });
    describe('# Sub category', function () {
        it('should get a subcategory by its id ', function (done) {
            request(app).get('/api/v1/subcategory/' + subcategoryId).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });
    describe('# Sub category', function () {
        it('should delete the subcategory that was created', function (done) {
            request(app).delete('/api/v1/subcategory/' + subcategoryId).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });
});



