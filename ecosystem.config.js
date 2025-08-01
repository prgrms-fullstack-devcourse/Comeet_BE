module.exports = {
    apps: [
        {
            name: 'comeet',
            script: 'dist/main.js',
            instances: 4,
            autorestart: true,
            watch: true,
            max_memory_restart: '300M',
            env: {
                NODE_ENV: 'production',
                HOST: '0.0.0.0',
            },
            log_file_options: {
                max_size: "10M",
                compress: true,
                rotateInterval: "0 0 * * *",
            },
        },
    ],
};