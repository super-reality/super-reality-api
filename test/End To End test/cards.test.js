const app = require('../../app')
const chai = require('chai')
const request = require('supertest');
const mongoose = require("mongoose");
mongoose.Promise = Promise;
const database = mongoose.connection;
const expect = chai.expect;

const createcardPayload = {
    "title": "sample card"
}
const createBoardPayload = {
    "title": "sample board"
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
let boardId = null
let boardColId = null
let token = null
let cardId = null

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
        it('should create a Board', function (done) {
            request(app).post('/api/v1/boards/create').send(createBoardPayload).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    boardId = res.body._id
                    createBoardItemsPayload.boardId = boardId
                    createcardPayload.boardId = boardId
                    expect(res.statusCode).to.equal(201);
                    done();
                }
            });
        });
    });
        describe('# Boards', function () {
        it('should create a new board item', function (done) {
            request(app).post('/api/v1/boards/item/create').send(createBoardItemsPayload).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    boardColId = res.body._id
                    createcardPayload.boardColId = boardColId
                    expect(res.statusCode).to.equal(201);
                    done();
                }
            });
        });
    });
    describe('# Cards', function () {
        it('should create a new card ', function (done) {
            request(app).post('/api/v1/cards/create').send(createcardPayload).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    cardId = res.body.card._id
                    expect(res.statusCode).to.equal(201);
                    done();
                }
            });
        });
    });
    describe('# Cards', function () {
        it('should get the card that was created', function (done) {
            request(app).get('/api/v1/cards/' + cardId).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });
       describe('# Cards', function () {
        it('should delete the card that was created', function (done) {
            request(app).delete('/api/v1/cards/' + cardId).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });
});



