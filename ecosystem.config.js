module.exports = {
  apps: [{
    name: 'neuroexpert',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    // Автоматический перезапуск при падении
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    // Оптимизация для production
    instance_var: 'INSTANCE_ID',
    merge_logs: true,
    // Мониторинг
    min_uptime: '10s',
    max_restarts: 10,
    // Graceful shutdown
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000
  }]
}