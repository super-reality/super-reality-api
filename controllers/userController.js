const {User} = require("../models");

const getUser = function (request, response) {
    User
        .find()
        .then(users => users.map(user => ({id: user.id, root: user.root, username: user.username})))
        .then(users => response.send({users}))
        .catch(error => response.sendStatus(500));
}

const createUser = function (request, response) {
    const {username, password} = request.body;
    User
        .findOne({username})
        .then(user => {
            if (user) {
                return Promise.reject(400);
            }
        })
        .then(() => {
            if (username && password) {
                const user = new User({root: false, username});
                user.setPassword(password);
                return user.save();
            } else {
                return Promise.reject(400);
            }
        })
        .then(user => ({id: user.id, root: user.root, username: user.username}))
        .then(user => response.send({user}))
        .catch(error => response.sendStatus(error ? error : 500));
}
const getUserById = function (request, response) {
    const {userId} = request.params;
    User
        .findById(userId)
        .then(user => user ? user : Promise.reject({status: 404}))
        .then(user => ({id: user.id, root: user.root, username: user.username}))
        .then(user => response.send({user}))
        .catch(error => response.sendStatus(error.status ? error.status : 500));
}
const updateUser = function (request, response) {

    const {userId} = request.params;
    User
        .findById(userId)
        .then(user => user ? user : Promise.reject({status: 404}))
        .then(user => ({id: user.id, root: user.root, username: user.username}))
        .then(user => response.send({user}))
        .catch(error => response.sendStatus(error.status ? error.status : 500));
}
const deleteUser = function (request, response) {
    const {userId} = request.params;
    User
        .findById(userId)
        .then(user => user ? user : Promise.reject({status: 404}))
        .then(user => ({id: user.id, root: user.root, username: user.username}))
        .then(user => response.send({user}))
        .catch(error => response.sendStatus(error.status ? error.status : 500));
}


module.exports = {createUser,getUser,getUserById,updateUser,deleteUser}
