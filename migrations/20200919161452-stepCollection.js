module.exports = {
    async up(db, client) {
        await db.createCollection("steps", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: [
                        "name",
                        "description"
                    ],

                    properties: {
                        // step Image
                        image: {bsonType: "string"},
                        // image function
                        imageFunction: {bsonType: "int"},
                        // additional image function
                        additionalFunctions: {bsonType: "array"},
                        // step name
                        name: { bsonType: "string" },
                        // step long description
                        description: { bsonType: "string"},
                        // trigger
                        trigger: {bsonType: "int"},
                        // next Step action
                        next: {bsonType: "int"},
                        // user id that created this step
                        createdBy: {bsonType: "objectId"},
                        // created date
                        createdAt: {bsonType: "date"},
                        updatedAt: {bsonType: "date"},

                    }
                }
            }

        }).then(function (steps) {
            steps.createIndex({
                name: 1,
            })
        }).catch(function (err) {
            console.error(err)
        })
    },

    async down(db, client) {
        await db.dropCollection("steps")
    },
};
