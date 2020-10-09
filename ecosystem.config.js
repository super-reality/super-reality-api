module.exports = {
    apps: [{
        script: 'server.js',
        watch: '.',
        restart_delay: 3000

    },],
    env_production: {
         PORT:"3000",
        NODE_ENV: "development",
    }
};
