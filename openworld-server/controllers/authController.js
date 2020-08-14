const express = require("express")
const jwt = require("jsonwebtoken")
const auth = require("../middleware/auth")
const User = require("../models/user")
const {hashDigest, hashSaltDigest} = require("../utilities/hashing")
const constant = require("../config/constant")

exports.signin = function(request, response){
    const {username, password} = request.body;
    // const {username, password} = request.query;

    User.findOne({username})
    .then(user => user ? user : response.status(401).json({err_code: constant.ERR_CODE.user_name_wrong, msg: "Wrong username"}))
    .then(user => user.passwordHash === hashSaltDigest(password, user.passwordSalt) ? user : response.status(401).json({salt: user.passwordSalt, hash: hashSaltDigest(password, user.passwordSalt),err_code: constant.ERR_CODE.user_password_wrong, msg: "Wrong password"}))
    .then(user => {
        const token = jwt.sign(
            {},
            process.env.JWT_SECRET,
            {
                subject: user.id,
                issuer: process.env.JWT_ISSUER,
                audience: process.env.JWT_AUDIENCE,
                expiresIn: process.env.JWT_EXPIRATION
            }
        );
        response.send({err_code: constant.ERR_CODE.success, user : user, token: token})
    })
    .catch(error => response.status(500).json({error: error.status ? error.status : 500}))
}

exports.signup = function(request, response){
    const {username, password, firstname, lastname, invitecode} = request.body;
    // const {username, password, firstname, lastname, invitecode} = request.query;
    User.findOne({username})
    .then(user => {
        if (user) {
            response.status(401).json({err_code: constant.ERR_CODE.user_already_exist, msg: "User already exist"})
        } else {
            var newUser = User()
            newUser.firstname = firstname
            newUser.lastname = lastname
            newUser.username = username
            newUser.invitecode = invitecode
            newUser.passwordSalt = hashDigest(Date.now().toString())
            newUser.passwordHash = hashSaltDigest(password, newUser.passwordSalt)

            newUser.save(function (err) {
                if (err != null) {
                    response.status(401).json({
                        error: err.status ? err.status : 500
                    });
                } else {
                    const token = jwt.sign(
                        {},
                        process.env.JWT_SECRET,
                        {
                            subject: newUser.id,
                            issuer: process.env.JWT_ISSUER,
                            audience: process.env.JWT_AUDIENCE,
                            expiresIn: process.env.JWT_EXPIRATION
                        }
                    );
                    response.json({
                        err_code: constant.ERR_CODE.success,
                        user: newUser,
                        token: token
                    });
                }
            });
        }
    })
    .catch(error => response.status(500).json({error: error.status ? error.status : 500}))
}

exports.verify = function(request, response) {
    response.sendStatus(200)
}