const request = require('supertest');
const {app} =require("../server");

var token;

const signupPayload = {
    username: "testindadgoonceagain@hotmail.com",
    firstname: "Emre",
    lastname: "Kayaoglu",
    invitecode: "45TGKR",
    password: "password"
}
const signinPayload = {
    username: "emrekayaoglu94@hotmail.com",
    password: "password"
}
const wrongUser = {
    username: "tesnceagain@hotmail.com",
    password: "dadasd"
}
describe('auth', () => {
    it('should not be able to login ', async () => {
        try {
            const unauthenticatedUser = await request(app).post('/api/v1/auth/signin').send(wrongUser)

            if (unauthenticatedUser) {
                console.log(unauthenticatedUser.body)

                expect(unauthenticatedUser.body).toHaveProperty('err_code')
            }
        } catch (error) {
            if (error) {
                expect(error.body.statusCode).toBe(500)
            }
        }

    })

    it('should create a new user or return an existing user', async () => {
        const signedupUser = await request(app).post('/api/v1/auth/signup').send(signupPayload)
        if (signedupUser) {
            expect(signedupUser.body).toHaveProperty('err_code')
        }
    })
    it('should return error for already existing user ', async () => {
        const existingUser = await request(app).post('/api/v1/auth/signup').send(signupPayload)
        if (existingUser) {
            expect(existingUser.body).toHaveProperty('err_code')
            token = existingUser.body.token
        }


    })

    it('should return error for already existing user ', async () => {
        const existingUser = await request(app).post('/api/v1/auth/signup').send(signupPayload)
        if (existingUser) {
            expect(existingUser.body).toHaveProperty('err_code')
        }


    });


    it('should  be able to login ', async () => {

        const loggedinUser = await request(app).post('/api/v1/auth/signin').send(signinPayload)
        if (loggedinUser) {
            expect(loggedinUser.body.user).toHaveProperty('username')
        }


    })

})

describe('collection', () => {

    const createCollectionPayload = {
        "icon": "https://gloimg.gbtcdn.com/images/pdm-product-pic/Electronic/2017/12/06/source-img/20171206112752_46994.jpg_500x500.jpg",
        "name": "Gamegen First Collection",
        "shortDescription": "This is Gamegen controller",
        "description": "This is Gamegen controller, This is Gamegen controller, This is Gamegen controller.",
        "tags": ["gamegen", "First", "controller"],
        "entry": 2
    }
    it('should  create a collection by logged in user ', async () => {

        await request(app).post('/api/v1/auth/signin').send(signinPayload).then(async (signedInUser) => {
            console.log(signedInUser)
            await request(app).post('/api/v1/collection/create').set('Authorization', 'Bearer ' + signedInUser.body.token).send(createCollectionPayload).then(createCollection => {
                console.log(createCollection)
                expect(createCollectionPayload.body.statusCode).toBe(200)
            })

        })
    })
})


module.exports = {app}

