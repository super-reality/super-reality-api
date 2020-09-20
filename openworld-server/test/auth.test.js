const request = require('supertest');
const app = require("../server")


describe('auth', () => {

    const signupPayload = {
        username: "testindadgoonceagain@hotmail.com",
        firstname: "Emre",
        lastname: "Kayaoglu",
        invitecode: "45TGKR",
        password: "password"
    }
    const signinPayload = {
        username: "testindadgoonceagain@hotmail.com",
        password: "password"
    }
    const wrongUser = {
        username: "testindadgoonceagain@hotmail.com",
        password: "dadasd"
    }

    it('should not be able to login ', async () => {
        const unauthenticatedUser = await request(app).post('/api/v1/auth/signin').send(wrongUser)
        if (unauthenticatedUser) {
            expect(unauthenticatedUser.body).toHaveProperty('err_code')
        }


    })
    test('some test title', async () => {
        const foo = true;
        await new Promise((r) => setTimeout(r, 5000));
        expect(foo).toBeDefined();
    });


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
        }


    })
    test('some test title', async () => {
        const foo = true;
        await new Promise((r) => setTimeout(r, 2000));
        expect(foo).toBeDefined();
    });
    it('should return error for already existing user ', async () => {
        const existingUser = await request(app).post('/api/v1/auth/signup').send(signupPayload)
        if (existingUser) {
            expect(existingUser.body).toHaveProperty('err_code')
        }


    });
    test('some test title', async () => {
        const foo = true;
        await new Promise((r) => setTimeout(r, 2000));
        expect(foo).toBeDefined();
    });

    it('should  be able to login ', async () => {

        const loggedinUser = await request(app).post('/api/v1/auth/signin').send(signinPayload)
        if (loggedinUser) {
            expect(loggedinUser.body.user).toHaveProperty('username')
        }


    })

})

