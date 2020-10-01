module.exports = {
    async up(db, client) {
        await db.createCollection("tasks", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: [
                        "name",
                        "description",
                        "cvType",
                        "sNumber",

                    ],

                    properties: {
                        // parent lesson id
                        lessonId: {bsonType: "objectId"},
                        // if child of task, then task id, else if, 0
                        parenttask: {bsonType: "string"},
                        // task icon url that generated from CV capture automatically
                        icon: {bsonType: "string"},
                        // task name
                        name: {bsonType: "string"},
                        // task long description
                        description: {bsonType: "string",},
                        // CV medias urls
                        cvMedias: {bsonType: "array"},
                        cvType: {bsonType: "string"},
                        // task number
                        sNumber: {bsonType: "int",},
                        // next task bsonType
                        nexttaskType: {bsonType: "string"},
                        // event bsonType
                        eventType: {bsonType: "string"},
                        // action bsonType
                        actionType: {bsonType: "string"},
                        // number of completions
                        numberOfCompletions: {bsonType: "string"},
                        // average user engagement
                        avgUserEngage: {bsonType: "string"},
                        // task url
                        taskUrl: {bsonType: "string"},
                        // user options
                        options: {bsonType: "array"},
                        // user id that created this task
                        createdBy: {bsonType: "objectId"},
                        // created date
                        createdAt: {bsonType: "date"},
                        updatedAt: {bsonType: "date"}

                    },
                },
            },
        }).then(function (tasks) {
            tasks.createIndex({
                name: 1,
            })
            tasks.createIndex({
                name: 1,
                createdAt: 1
            })
            tasks.createIndex({
                name: 1,
                createdBy: 1
            })
        })
    },

    async down(db, client) {
        await db.dropCollection("tasks")
    },
};
