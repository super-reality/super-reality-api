module.exports = {
    apps: [{
        script: 'server.js',
        watch: '.'

    },],
    env: {
        NODE_ENV: "development",
    },
    env_production: {
        "PORT": 3001,
        "NODE_ENV": "production",
    }
};
