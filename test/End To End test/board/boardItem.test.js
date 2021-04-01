const app = require('../../../app')
const chai = require('chai')
const request = require('supertest');
const mongoose = require("mongoose");
mongoose.Promise = Promise;
const database = mongoose.connection;
const expect = chai.expect;

const createBoardsPayload = {
    "title": "sample Boards"
}
const createBoardItemsPayload = {
    "col": 1,
    "title": "item1"
}
const loginPayload =
    {
        "username": "sifantest@gmail.com",
        "password": "sifan059"
    }
let BoardsId = null
let token = null
let itemId = null

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
    describe('## Boards ', function () {
        it('should create a Boards', function (done) {
            request(app).post('/api/v1/boards/create').send(createBoardsPayload).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    BoardsId = res.body._id
                    createBoardItemsPayload.boardId = BoardsId
                    expect(res.statusCode).to.equal(201);
                    done();
                }
            });
        });
    });
    describe('# Boards', function () {
        it('should get all Boardss', function (done) {
            request(app).post('/api/v1/boards/item/create').send(createBoardsPayload).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    itemId = res.body._id
                    expect(res.statusCode).to.equal(201);
                    done();
                }
            });
        });
    });

    describe('# Boards', function () {
        it('should get a specific item of any board by its id', function (done) {
            request(app).get('/api/v1/boards/item/' + itemId).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });
    describe('# Boards', function () {
        it('should delete a specific item of any board by its id', function (done) {
            request(app).delete('/api/v1/boards/item/' + itemId).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });
    describe('# Boards', function () {
        it('should get all board items by board id ', function (done) {
            request(app).get('/api/v1/boards/items/' + BoardsId).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });
    describe('# Boards', function () {
        it('should delete all the boards that was created for a specific board', function (done) {
            request(app).delete('/api/v1/boards/items/' + BoardsId).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });
});



