module.exports = {
    apps: [{
        script: 'nodemon server.js',
        watch: '.',
        restart_delay: 3001

    },],
    env_production: {
         PORT:"3000",
        NODE_ENV: "development",
    }
};
