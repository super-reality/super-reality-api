const app = require('../../app')
const chai = require('chai')
const request = require('supertest');
const mongoose = require("mongoose");
mongoose.Promise = Promise;
const database = mongoose.connection;
const expect = chai.expect;


const createChapterPayload = {
    "name": "testing automated  and creating chapter for students "
}

const updateChapterPayload = {
    "name": "test chapter updating",
    "steps": [
        {
            "_id": "5f7c82e0e42dbd619e821788",
            "name": "good"
        }
    ]
}
const loginPayload =
    {
        "username": "sifantest@gmail.com",
        "password": "sifan059"
    }

let chapterId = null
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


    describe('## Chapters ', function () {
        it('should create a chapter', function (done) {
            request(app).post('/api/v1/chapter/create').send(createChapterPayload).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    chapterId = res.body.chapter._id
                    updateChapterPayload.chapter_id = chapterId
                    expect(res.statusCode).to.equal(201);
                    done();
                }
            });
        });
    });
    describe('# Chapters', function () {
        it('should get all chapters', function (done) {
            request(app).get('/api/v1/chapter').set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });
    describe('# Chapters', function () {
        it('should get a chapter by its id ', function (done) {
            request(app).get('/api/v1/chapter/' + chapterId).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });
        describe('# Chapters', function () {
        it('should steps of a chapter ', function (done) {
            request(app).get('/api/v1/chapter/steps/' + chapterId).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });

    describe('# Chapters', function () {
        it('should update the chapter that was created', function (done) {
            request(app).put('/api/v1/chapter/').send(updateChapterPayload).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });
    describe('# Chapters', function () {
        it('should delete the chapter that was created', function (done) {
            request(app).delete('/api/v1/chapter/' + chapterId).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });


});



