module.exports = {
    async up(db, client) {
        await db.collection.createIndex({
            name: 1,
            shortDescription: 1
        })
        await db.collection.createIndex({
            name: 1
        })
        await db.collection.createIndex({
            shortDescription: 1
        })
    },

    async down(db, client) {
        await db.collection.dropIndex({
            name: 1,
            shortDescription: 1
        })
        await db.collection.dropIndex({
            name: 1
        })
        await db.collection.dropIndex({
            shortDescription: 1
        })
    },
};
