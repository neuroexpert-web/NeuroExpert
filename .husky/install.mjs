// Скрипт для условной установки Husky
// Пропускает установку в CI/CD окружениях

if (process.env.CI || process.env.VERCEL || process.env.NETLIFY) {
  console.log('Skipping Husky install in CI/CD environment');
  process.exit(0);
}