module.exports = {
    async up(db, client) {
        await db.createCollection("lessons", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: [
                        "parent",
                        "icon",
                        "name",
                        "description"
                    ],

                    properties: {
                        // parent subject id or lesson id
                        parent: {bsonType: "array"},
                        // lesson icon url
                        icon: {bsonType: "string"},
                        // lesson name
                        name: {bsonType: "string"},
                        // lesson short description
                        shortDescription: {bsonType: "string"},
                        // lesson long description
                        description: {bsonType: "string"},
                        // difficulty
                        difficulty: {bsonType: "int"},
                        // medias urls
                        medias: {bsonType: "array"},
                        // total steps
                        totalSteps: {bsonType: "array"},
                        // tag Array
                        tags: {bsonType: "array"},
                        // visibility
                        visibility: {bsonType: "array"},
                        // ownership
                        ownership: {bsonType: "array"},
                        // entry
                        entry: {bsonType: "int"},
                        // lesson Rating
                        rating: {bsonType: "int"},
                        // total rating count. this is used for new rating
                        ratingCount: {bsonType: "int"},
                        // number of shares
                        numberOfShares: {bsonType: "int"},
                        // number of activations
                        numberOfActivations: {bsonType: "int"},
                        // number of completions
                        numberOfCompletions: {bsonType: "int"},
                        // average user engagement
                        avgUserEngage: {bsonType: "string"},
                        // user options
                        options: {bsonType: "array"},
                        // if remixed
                        isRemixed: {bsonType: "bool"},
                        // original lesson id where remixed from
                        remixedFrom: {bsonType: "string"},
                        // user id that created this lesson
                        createdBy: {bsonType: "objectId"},
                        // created date
                        createdAt: {bsonType: "date"},
                        updatedAt: {bsonType: "date"},

                    }
                }
            }

        }).then(function (lessons) {
            lessons.createIndex({
                name: 1,
            })
            lessons.createIndex({
                shortDescription: 1,
            })
            lessons.createIndex({
                name: 1,
                shortDescription: 1
            })
            lessons.createIndex({
                name: 1,
                createdAt: 1
            })
        }).catch(function(err)
        {
          console.error(err)
        })
    },

    async down(db, client) {
        await db.dropCollection("lessons")
    },
};
