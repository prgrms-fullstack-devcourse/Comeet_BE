
module.exports = {
    apps: [{
        name: "comeet",
        script: "dist/main.js",
        watch: true,
        instances: 3,
        exec_mode: "cluster",
        max_memory_restart: "10M",
    }]
};