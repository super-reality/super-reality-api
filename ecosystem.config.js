module.exports = {
    apps: [{
        script: 'server.js',
        restart_delay: 10000,
        exp_backoff_restart_delay: 100,
        error_file: 'err.log',
        out_file: 'out.log',
        log_file: 'combined.log',
        time: true,
        kill_timeout: 3000,
        ignore_watch:['err.log','combined.log','out.log']
    },],
    env_production: {
        PORT: "3000",
        NODE_ENV: "development",
    }
};
