module.exports = {
    async up(db, client) {
        await db.createCollection("tags", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: [
                        "name",
                    ],

                    properties: {
                        // tag name
                        name: {bsonType: "string"},
                        // tag type : either of collection, subject, lesson, organization
                        type: {bsonType: "string"},
                    }
                }
            }

        }).then(function (tags) {
            tags.createIndex({
                name: 1,
            })
        }).catch(function (err) {
            console.error(err)
        })
    },

    async down(db, client) {
        await db.dropCollection("tags")
    },
};
