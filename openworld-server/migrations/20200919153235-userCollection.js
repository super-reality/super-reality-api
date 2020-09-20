module.exports = {
    async up(db, client) {
        await db.createCollection("users", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: [
                        "firstname",
                        "lastname",
                        "username"
                    ],

                    properties: {
                        passwordHash: {
                            bsonType: "string"
                        },
                        passwordSalt: {
                            bsonType: "string"
                        },
                        root: {
                            bsonType: "bool"
                        },
                        username: {
                            bsonType: "string",
                        },
                        firstname: {bsonType: "string"},
                        lastname: {bsonType: "string"},
                        inviteCode: {bsonType: "string"},
                        age: {bsonType: "int"},
                        // description
                        description: {bsonType: "string"},
                        budget: {bsonType: "int"},
                        escrow: {bsonType: "int"},
                        // visibility: either of Public/Team/Private
                        visibility: {bsonType: "string"},
                        role: {bsonType: "string"},
                        createdAt: {bsonType: "date"},
                        updatedAt: {bsonType: "date"},

                    },
                },
            },
        }).then(function (users) {
            users.createIndex({
                username: 1,
            })
            users.createIndex({
                username: 1,
                createdAt: 1
            })
        })
    },

    async down(db, client) {
        await db.dropCollection("users")
    },
};
