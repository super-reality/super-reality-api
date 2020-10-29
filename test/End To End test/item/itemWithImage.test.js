const app = require('../../../app')
const chai = require('chai')
const request = require('supertest');
const mongoose = require("mongoose");
mongoose.Promise = Promise;
const database = mongoose.connection;
const expect = chai.expect;

const createdefaultItemPayload = {
    "type": "image"
}
const loginPayload =
    {
        "username": "sifantest@gmail.com",
        "password": "sifan059"
    }
const propeties = ["relativePos",
    "name",
    "anchor",
    "trigger",
    "destination",
    "transition",
    "_id",
    "createdAt",
    "type",
    "url",
    "__v"]

let itemId = null
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
    describe('## Items ', function () {
        it('should create a item with default values with image type', function (done) {
            request(app).post('/api/v1/item/create').send(createdefaultItemPayload).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    itemId = res.body.item._id
                    expect(res.statusCode).to.equal(201);
                    done();
                }
            });
        });
    });

    describe('# Items', function () {
        it('should get a item with default values with image type using id', function (done) {
            request(app).get('/api/v1/item/' + itemId).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });
    describe('# Items', function () {
        it('should delete the item that was created', function (done) {
            request(app).delete('/api/v1/item/' + itemId).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });
});



