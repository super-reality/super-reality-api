module.exports = {
    async up(db, client) {
        await db.steps.createIndex({
            name: 1,
        })
    },

    async down(db, client) {
        await db.steps.createIndex({
            name: 1,
        })
    },
};
