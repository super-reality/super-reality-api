// const request = require('supertest')
// const Collection = require('../models/collection')
// const {
//     setupDatabase,
//     userCorrectOne,
//     userCorrectTwo,
//     userCorrectThree,
//     userIncorrectOne,
//     userIncorrectTwo,
//     userIncorrectThree,
//     collectionCorrectOne,
//     collectionCorrectTwo,
//     collectionCorrectThree,
//     collectionIncorrectOne,
//     collectionIncorrectTwo,
//     collectionIncorrectThree
// } = require('./fixtures/db')

// const app = require('../app')


// beforeEach(setupDatabase)




// afterAll(() => 
// let token;

// beforeAll((done) => {
//   request(app)
//     .post('/login')
//     .send({
//       username: 'JackMacPac',
//       password: 'jdjdjdjdjdjd',
//     })
//     .end((err, response) => {
//       token = response.body.token; // save the token!
//       done();
//     });
// });
// 

// 
// 

// test('Should delete all collections', async () => {
//     const response = await request(app)

// })
// 
// test('Should create a new valid Collection by an authorized User', async () => {
//     //Attempt to create new collection
//     const response = await request(app)
//         .post('/api/v1/collection/create')
//         .set('Authorization', `Bearer ${userCorrectOne.tokens[0].token}`)
//         // .send(collectionCorrectOne)
//         .send({"icon": "aaaaaaaaaaaaa"})
//         .expect(201)
//         // .then((response) => {
//         //     expect(response.statusCode).toBe(201);
//         //     expect(response.type).toBe('application/json');
//         //   });
//         // .catch()
//         const collection = await Collection.findById(response.body._id)

// })

// test('Should get a new valid Collection by an authorized User', async () => {
//     //Attempt to create new collection
//     const response = await request(app)
//         .post('/api/v1/collection/5f501e52400eae4a5c2a4d03')
//         // .set('Authorization', `Bearer ${userCorrectOne.tokens[0].token}`)
//         .expect(201)
    
//     //Retrieve the newly created collection
//     const collection = await Collection.findById(response.body._id)
//     expect(collection).not.toBeNull()
// })

// test('Should not be able to create a new valid Collection by an unauthorized User', async () => {
//     //Attempt to create new collection
//     const response = await request(app)
//         .post('/api/v1/collection/create')
//         .set('Authorization', `Bearer ${userIncorrectOne.tokens[0].token}`)
//         .send(collectionCorrectOne)
//         .expect(404)
//         //Retrieve the newly created collection
//     const collection = await Collection.findById(response.body._id)
//     expect(collection).not.toBeNull()
// })

// test('Should not be able to create a new invalid Collection by an authorized User', async () => {
//     //Attempt to create new collection
//     const response = await request(app)
//         .post('/api/v1/collection/create')
//         .set('Authorization', `Bearer ${userCorrectOne.tokens[0].token}`)
//         .send(collectionIncorrectOne)
//         .expect(201)

//     //Retrieve the newly created collection
//     const collection = await Collection.findById(response.body._id)
//     expect(collection).not.toBeNull()
// })

// test('Should not be able to create a new invalid Collection by an unauthorized User', async () => {
//     //Attempt to create new collection
//     const response = await request(app)
//         .post('/api/v1/collection/create')
//         .set('Authorization', `Bearer ${userIncorrectOne.tokens[0].token}`)
//         .send(collectionIncorrectTwo)
//         .expect(404)
//         //Retrieve the newly created collection
//     const collection = await Collection.findById(response.body._id)
//     expect(collection).not.toBeNull()
// })

// test('Should get Collection details for an authorized user from a valid Collection', async () => {
//     //Attempt to create new collection
//     const response = await request(app)
//         .post(`/api/v1/collection/${collectionCorrectOne.id}`)
//         .set('Authorization', `Bearer ${userCorrectOne.tokens[0].token}`)
//         .send(collectionCorrectOne)
//         .expect(201)

//     //Retrieve the newly created collection
//     const collection = await Collection.findById(response.body._id)
//     expect(collection).not.toBeNull()
// })

// test('Should not get Collection details for an unauthorized user from a valid Collection', async () => {
//     //Attempt to create new collection
//     const response = await request(app)
//         .post(`/api/v1/collection/${collectionCorrectTwo.id}`)
//         .set('Authorization', `Bearer ${UserIncorrectThree.tokens[0].token}`)
//         .send(collectionCorrectTwo)
//         .expect(404)

//     //Retrieve the newly created collection
//     const collection = await Collection.findById(response.body._id)
//     expect(collection).not.toBeNull()
// })

// test('Should not get Collection details for an authorized user from an invalid Collection', async () => {
//     //Attempt to create new collection
//     const response = await request(app)
//         .post(`/api/v1/collection/${collectionIncorrectThree.id}`)
//         .set('Authorization', `Bearer ${userCorrectThree.tokens[0].token}`)
//         .send(collectionIncorrectThree)
//         .expect(201)

//     //Retrieve the newly created collection
//     const collection = await Collection.findById(response.body._id)
//     expect(collection).not.toBeNull()
// })

// test('Should not get Collection details for an unauthorized user from an invalid Collection', async () => {
//     //Attempt to create new collection
//     const response = await request(app)
//         .post(`/api/v1/collection/${collectionIncorrectThree.id}`)
//         .set('Authorization', `Bearer ${UserIncorrectThree.tokens[0].token}`)
//         .send(collectionIncorrectThree)
//         .expect(404)

//     //Retrieve the newly created collection
//     const collection = await Collection.findById(response.body._id)
//     expect(collection).not.toBeNull()
// })

// test('Should get a list of Collections based on a search query by an authorized user', async () => {
//     //Attempt to create new collection
//     const response = await request(app)
//         .post(`/api/v1/collection/${collectionCorrectOne.id}`)
//         .set('Authorization', `Bearer ${userCorrectOne.tokens[0].token}`)
//         .send(collectionCorrectOne)
//         .expect(201)

//     //Retrieve the newly created collection
//     const collection = await Collection.findById(response.body._id)
//     expect(collection).not.toBeNull()
//     //Expect(collection) to contain query string
// })

// test('Should not get a list of Collections based on a search query by an unauthorized user', async () => {
//     //Attempt to create new collection
//     const response = await request(app)
//         .post(`/api/v1/collection/${collectionCorrectTwo.id}`)
//         .set('Authorization', `Bearer ${UserIncorrectThree.tokens[0].token}`)
//         .send(collectionCorrectTwo)
//         .expect(404)

//     //Retrieve the newly created collection
//     const collection = await Collection.findById(response.body._id)
//     expect(collection).not.toBeNull()
//         //Expect(collection) to contain query string

// })

