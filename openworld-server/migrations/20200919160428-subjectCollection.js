module.exports = {
    async up(db, client) {
        await db.createCollection("subjects", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: [
                        "name",
                        "description"
                    ],

                    properties: {
                        // parent collection id
                        parent: {bsonType: "array"},
                        // subject icon url
                        icon: {bsonType: "string"},
                        // subject name
                        name: {
                            bsonType: "string",
                        },
                        // subject short description
                        shortDescription: {
                            bsonType: "string",
                        },
                        // subject long description
                        description: {
                            bsonType: "string",
                        },
                        // tag Array
                        tags: {bsonType: "array"},
                        // medias urls
                        medias: {bsonType: "array"},
                        // visibility
                        visibility: {bsonType: "string"},
                        // entry
                        entry: {bsonType: "string"},
                        // number of shares
                        numberOfShares: {bsonType: "int"},
                        // number of activations
                        numberOfActivations: {bsonType: "int"},
                        // number of completions
                        numberOfCompletions: {bsonType: "int"},
                        // user options
                        options: {bsonType: "array"},
                        // if remixed
                        isRemixed: {bsonType: "bool"},
                        // original Subject id where remixed from
                        remixedFrom: {bsonType: "string"},
                        // user id that created this subject
                        createdBy: {bsonType: "objectId"},
                        // created date
                        createdAt: {bsonType: "date"},
                        updatedAt: {bsonType: "date"},
                    }
                }
            }

        }).then(function (subjects) {
            subjects.createIndex({
                name: 1,
            })
            subjects.createIndex({
                shortDescription: 1,
            })
            subjects.createIndex({
                name: 1,
                shortDescription: 1
            })
            subjects.createIndex({
                name: 1,
                createdAt: 1
            })
        }).catch(function (err) {
            console.error(err)
        })
    },

    async down(db, client) {
        await db.dropCollection("subjects")
    },
};
