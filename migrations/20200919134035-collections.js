module.exports = {
    async up(db, client) {
        await db.createCollection("collections", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: [
                        "name",
                        "description",
                    ],

                    properties: {
                        icon: {
                            bsonType: "string",
                        },
                        // collection name
                        name: {
                            bsonType: "string",
                            description: "must be a string and is required",
                        },
                        // collection short description
                        shortDescription: {
                            bsonType: "string",
                        },
                        // collection long description
                        description: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        // tag Array
                        tags: {bsonType: "array"},
                        // medias urls
                        medias: {bsonType: "array"},
                        // visibility
                        visibility: {bsonType: "string"},
                        entry: {bsonType: "string"},
                        // number of shares
                        numberOfShares: {bsonType: "int"},
                        // number of activations
                        numberOfActivations: {bsonType: "int"},
                        // total number of subjects
                        numberOfSubjects: {bsonType: "int"},
                        // total number of lessons
                        numberOfLessons: {bsonType: "int"},
                        // average user engagement
                        avgUserEngage: {bsonType: "string"},
                        // user options
                        options: {bsonType: "array"},
                        // if remixed
                        isRemixed: {bsonType: "bool"},
                        // original collection id where remixed from
                        remixedFrom: {bsonType: "string"},
                        // user id that created this collection
                        createdBy: {bsonType: "objectId"},
                        // created date
                        createdAt: {bsonType: "date"},
                        //update update
                        updatedAt: {bsonType: "date"},
                    },
                },
            },
        }).then(function (collections) {
            collections.createIndex({
                name: 1,
                shortDescription: 1
            })
            collections.createIndex({
                name: 1
            })
            collections.createIndex({
                shortDescription: 1
            })
        })
    },

    async down(db, client) {
        await db.dropCollection("collections")
    },
};
