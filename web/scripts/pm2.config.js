/**
 * PM2 Configuration for KSS Ontology
 *
 * PM2를 사용한 프로덕션 배포 설정
 *
 * 설치:
 *   npm install -g pm2
 *
 * 사용법:
 *   pm2 start scripts/pm2.config.js
 *   pm2 logs
 *   pm2 monit
 *   pm2 restart kss-ontology
 *   pm2 stop kss-ontology
 */

module.exports = {
  apps: [
    {
      name: 'kss-ontology',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: __dirname + '/..',
      instances: 1,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
    {
      name: 'kss-scheduler',
      script: 'node_modules/.bin/tsx',
      args: 'scripts/scheduler-daemon.ts',
      cwd: __dirname + '/..',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        ENABLE_DAILY_BATCH: 'true',
        ENABLE_WEEKLY_REEVALUATION: 'false',
        ENABLE_MONTHLY_ARCHIVING: 'false',
        ENABLE_HEALTH_CHECK: 'true',
      },
      error_file: './logs/scheduler-error.log',
      out_file: './logs/scheduler-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      restart_delay: 5000,
      autorestart: true,
    },
  ],
}
