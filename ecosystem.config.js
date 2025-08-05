
module.exports = {
    apps: [{
        name: "comeet",
        script: "dist/main.js",
        watch: false,
        instances: 3,
        exec_mode: "cluster",
        max_memory_restart: "256M",
        output: "/dev/stdout",
        error: "/dev/stderr",
    }]
};