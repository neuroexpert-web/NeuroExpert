module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // Новая функциональность
        'fix', // Исправление ошибок
        'docs', // Изменения в документации
        'style', // Изменения стилей (форматирование, отступы и т.д.)
        'refactor', // Рефакторинг кода
        'perf', // Улучшение производительности
        'test', // Добавление или изменение тестов
        'chore', // Изменения в процессе сборки или вспомогательных инструментах
        'revert', // Откат коммита
        'security', // Исправления безопасности
        'ci', // Изменения в CI/CD
      ],
    ],
    'subject-case': [2, 'never', ['upper-case', 'pascal-case']],
    'subject-full-stop': [2, 'never', '.'],
    'subject-min-length': [2, 'always', 5],
    'body-max-line-length': [2, 'always', 100],
  },
};
