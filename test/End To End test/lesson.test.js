const app = require('../../app')
const chai = require('chai')
const request = require('supertest');
const mongoose = require("mongoose");
mongoose.Promise = Promise;
const database = mongoose.connection;
const expect = chai.expect;


const createLessonPayload = {
    "subject": [{"_id": "5f6d38a4b1e8473ad42ae124"}],
    "difficulty": 3,
    "skills": ["html", "css"],
    "icon": "https://s3.us-west-1.amazonaws.com/openverse-lms/lesson-1601038232997.png",
    "name": "Test lesson for test cases",
    "shortDescription": "again",
    "description": "will delete this",
    "medias": ["https://s3.us-west-1.amazonaws.com/openverse-lms/lesson-1601038233109.png"],
    "visibility": false,
    "entry": 2,
    "setupFiles": ["https://s3.us-west-1.amazonaws.com/openverse-lms/lesson-1601038233109.png"],
    "setupScreenshots": ["https://s3.us-west-1.amazonaws.com/openverse-lms/lesson-1601038233109.png"],
    "setupInstructions": "this is the instruction you should follow"

}
const updateLessonPayload = {
    "subject": [{"_id": "5f6d38a4b1e8473ad42ae124"}],
    "difficulty": 2,
    "skills": ["html", "updatefeature"],
    "icon": "https://s3.us-west-1.amazonaws.com/openverse-lms/lesson-1601038232997.png",
    "name": "update Test lesson for test cases",
    "shortDescription": "update short description",
    "description": "will update lesson ",
    "medias": ["https://s3.us-west-1.amazonaws.com/openverse-lms/lesson-1601038233109.png"],
    "visibility": true,
    "entry": 2,
    "setupFiles": ["https://s3.us-west-1.amazonaws.com/openverse-lms/lesson-1601038233109.png"],
    "setupScreenshots": ["https://s3.us-west-1.amazonaws.com/openverse-lms/lesson-1601038233109.png"],
    "setupInstructions": "this is the instruction you should follow"

}
const loginPayload =
    {
        "username": "sifantest@gmail.com",
        "password": "sifan059"
    }

let lessonId = null
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
                    token = res.body.token;
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });

    describe('## Lessons', function () {
        it('should create a lesson', function (done) {
            request(app).post('/api/v1/lesson/create').send(createLessonPayload).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    lessonId = res.body.lesson._id
                    updateLessonPayload.lesson_id = lessonId
                    expect(res.statusCode).to.equal(201);
                    done();
                }
            });
        });
    });


    describe('# Lessons', function () {
        it('should get a lesson by its id ', function (done) {
            request(app).get('/api/v1/lesson/' + lessonId).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });
      describe('# Lessons', function () {
        it('should get chapters of a lesson id ', function (done) {
            request(app).get('/api/v1/lesson/chapters/' + lessonId).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });


    describe('# Lessons', function () {
        it('should update a lesson by its id ', function (done) {
            request(app).put('/api/v1/lesson/').send(updateLessonPayload).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });

    describe('# Lessons', function () {
        it('should delete the  lesson was created', function (done) {
            request(app).delete('/api/v1/lesson/' + lessonId).set('Authorization', 'Bearer ' + token).end(function (err, res) {
                if (res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                }
            });
        });
    });


});



