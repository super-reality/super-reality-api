

const request = require('supertest');
const app = require("../app");
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;




console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

// console.log(loggedinUser.request._data.username)

const {
    setupDatabase,
    // userCorrectOne,
    // userCorrectTwo,
    // userCorrectThree,
    // userIncorrectOne,
    // userIncorrectTwo,
    // userIncorrectThree,
    // collectionCorrectOne,
    // collectionCorrectTwo,
    // collectionCorrectThree,
    // collectionIncorrectOne,
    // collectionIncorrectTwo,
    // collectionIncorrectThree
} = require('./fixtures/db')


beforeEach(setupDatabase)


var token;

const signupPayloadDev = {
    username: "MX",
    firstname: "Fart",
    lastname: "Pants",
    invitecode: "45TGKR",
    password: "password"
}

const signupPayload = {
    username: "MX",
    firstname: "Fart",
    lastname: "Pants",
    invitecode: "45TGKR",
    password: "password"
}

const signinPayload = {
    username: "MX1",
    password: "56what!!2"
}
const wrongUser = {
    username: "tesnceagain@hotmail.com",
    password: "dadasd"
}


test('should  be able to login ', async () => {

    const loggedinUser = await request(app)
    .post('/api/v1/auth/signin')
    .send(signinPayload)
    if (loggedinUser) {
        expect(loggedinUser.request._data).toHaveProperty('username')
    }
    
})

// test('should create a new user or return an existing user', async () => {
//     const signedupUser = await request(app)
//     .post('/api/v1/auth/signup')
//     .send(signupPayload)
//     // console.log(signedupUser)
//     // if (signedupUser) {
//     //     expect(signedupUser.body).toHaveProperty('err_code')
//     // }
// })


// test('should not be able to login ', async () => {
//     try {
//         const unauthenticatedUser = await request(app).post('/api/v1/auth/signin').send(wrongUser)
//         if (unauthenticatedUser) {
//             expect(unauthenticatedUser.body).toHaveProperty('err_code')
//         }
//     } catch (error) {
//         if (error) {
//             expect(error).toBe(500)
//             // expect(error.body.statusCode).toBe(500)
//         }
//     }
// })



// test('should return error for already existing user ', async () => {
//     const existingUser = await request(app).post('/api/v1/auth/signup').send(signupPayload)
//     if (existingUser) {
//         expect(existingUser.body).toHaveProperty('err_code')
//         token = existingUser.body.token
//     }
// })

// test('should return error for already existing user ', async () => {
//     const existingUser = await request(app).post('/api/v1/auth/signup').send(signupPayload)
//     if (existingUser) {
//         expect(existingUser.body).toHaveProperty('err_code')
//     }
// });





// describe('collection', () => {

//     const createCollectionPayload = {
//         "icon": "https://gloimg.gbtcdn.com/images/pdm-product-pic/Electronic/2017/12/06/source-img/20171206112752_46994.jpg_500x500.jpg",
//         "name": "Gamegen First Collection",
//         "shortDescription": "This is Gamegen controller",
//         "description": "This is Gamegen controller, This is Gamegen controller, This is Gamegen controller.",
//         "tags": ["gamegen", "First", "controller"],
//         "entry": 2
//     }
//     it('should  create a collection by logged in user ', async () => {

//         await request(app).post('/api/v1/auth/signin').send(signinPayload).then(async (signedInUser) => {

//             await request(app).post('/api/v1/collection/create').set('Authorization', 'Bearer ' + signedInUser.body.token).send(createCollectionPayload).then(createCollection => {

//                 expect(createCollectionPayload.body.statusCode).toBe(200)
//             })

//         })
//     })
// })


module.exports = { app }

