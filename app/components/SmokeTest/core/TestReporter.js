/**
 * Генератор отчетов для тестов
 */

import { TEST_STATUS, TEST_PRIORITY, REPORT_CONFIG } from '../constants/testConstants';

export class TestReporter {
  constructor(config = {}) {
    this.config = { ...REPORT_CONFIG, ...config };
  }

  generateReport(testResults) {
    const summary = this.calculateSummary(testResults);
    const detailedResults = this.formatDetailedResults(testResults);
    const recommendations = this.generateRecommendations(testResults);
    
    const report = {
      summary,
      results: detailedResults,
      recommendations,
      timestamp: new Date().toISOString(),
      duration: this.calculateTotalDuration(testResults)
    };
    
    if (this.config.SAVE_TO_FILE) {
      this.saveReportToFile(report);
    }
    
    return report;
  }

  calculateSummary(testResults) {
    const total = testResults.length;
    const passed = testResults.filter(r => r.status === TEST_STATUS.PASSED).length;
    const failed = testResults.filter(r => r.status === TEST_STATUS.FAILED).length;
    const skipped = testResults.filter(r => r.status === TEST_STATUS.SKIPPED).length;
    
    const byPriority = {
      critical: this.getResultsByPriority(testResults, TEST_PRIORITY.CRITICAL),
      high: this.getResultsByPriority(testResults, TEST_PRIORITY.HIGH),
      medium: this.getResultsByPriority(testResults, TEST_PRIORITY.MEDIUM),
      low: this.getResultsByPriority(testResults, TEST_PRIORITY.LOW)
    };
    
    return {
      total,
      passed,
      failed,
      skipped,
      passRate: total > 0 ? ((passed / total) * 100).toFixed(1) + '%' : '0%',
      byPriority,
      status: this.getOverallStatus(byPriority)
    };
  }

  getResultsByPriority(testResults, priority) {
    const priorityTests = testResults.filter(r => r.priority === priority);
    const passed = priorityTests.filter(r => r.status === TEST_STATUS.PASSED).length;
    const total = priorityTests.length;
    
    return {
      total,
      passed,
      failed: total - passed,
      passRate: total > 0 ? ((passed / total) * 100).toFixed(1) + '%' : '0%'
    };
  }

  getOverallStatus(byPriority) {
    // Если хотя бы один критический тест провален
    if (byPriority.critical.failed > 0) {
      return 'CRITICAL_FAILURE';
    }
    
    // Если провалено больше 50% высокоприоритетных тестов
    if (byPriority.high.total > 0 && (byPriority.high.failed / byPriority.high.total) > 0.5) {
      return 'HIGH_FAILURE';
    }
    
    // Если все тесты пройдены
    const totalFailed = Object.values(byPriority).reduce((sum, p) => sum + p.failed, 0);
    if (totalFailed === 0) {
      return 'ALL_PASSED';
    }
    
    return 'PARTIAL_FAILURE';
  }

  formatDetailedResults(testResults) {
    return testResults.map(result => {
      const formatted = {
        testId: result.testId,
        testName: result.testName,
        priority: result.priority,
        status: result.status,
        duration: `${result.duration.toFixed(0)}ms`,
        passedSteps: result.steps.filter(s => s.status === TEST_STATUS.PASSED).length,
        totalSteps: result.steps.length
      };
      
      if (this.config.SHOW_DETAILS && result.status === TEST_STATUS.FAILED) {
        formatted.errors = result.errors;
        formatted.failedSteps = result.steps
          .filter(s => s.status === TEST_STATUS.FAILED)
          .map(s => ({
            action: s.action,
            expected: s.expected,
            actual: s.actual,
            error: s.error
          }));
      }
      
      return formatted;
    });
  }

  generateRecommendations(testResults) {
    const recommendations = [];
    const summary = this.calculateSummary(testResults);
    
    if (summary.byPriority.critical.failed > 0) {
      recommendations.push({
        level: 'CRITICAL',
        message: 'Критические тесты провалены! Необходимо немедленное исправление перед деплоем.',
        tests: testResults
          .filter(r => r.priority === TEST_PRIORITY.CRITICAL && r.status === TEST_STATUS.FAILED)
          .map(r => r.testName)
      });
    }
    
    if (summary.passRate < 80) {
      recommendations.push({
        level: 'HIGH',
        message: `Общий процент прохождения тестов (${summary.passRate}) ниже рекомендуемого порога 80%.`
      });
    }
    
    // Анализ производительности
    const slowTests = testResults.filter(r => r.duration > 10000);
    if (slowTests.length > 0) {
      recommendations.push({
        level: 'MEDIUM',
        message: `${slowTests.length} тестов выполняются слишком долго (>10 секунд).`,
        tests: slowTests.map(r => ({
          name: r.testName,
          duration: `${(r.duration / 1000).toFixed(1)}s`
        }))
      });
    }
    
    return recommendations;
  }

  calculateTotalDuration(testResults) {
    const total = testResults.reduce((sum, r) => sum + r.duration, 0);
    return `${(total / 1000).toFixed(1)}s`;
  }

  saveReportToFile(report) {
    // В реальном приложении здесь будет сохранение в файл
    console.log('📄 Отчет сохранен:', this.config.reportPath);
  }

  generateConsoleReport(testResults) {
    const summary = this.calculateSummary(testResults);
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 ОТЧЕТ SMOKE-ТЕСТОВ');
    console.log('='.repeat(50));
    
    console.log(`\n📈 Общая статистика:`);
    console.log(`   Всего тестов: ${summary.total}`);
    console.log(`   ✅ Пройдено: ${summary.passed}`);
    console.log(`   ❌ Провалено: ${summary.failed}`);
    console.log(`   ⏭️  Пропущено: ${summary.skipped}`);
    console.log(`   📊 Процент успеха: ${summary.passRate}`);
    
    console.log(`\n🎯 По приоритетам:`);
    Object.entries(summary.byPriority).forEach(([priority, stats]) => {
      if (stats.total > 0) {
        const emoji = stats.failed > 0 ? '❌' : '✅';
        console.log(`   ${emoji} ${priority}: ${stats.passed}/${stats.total} (${stats.passRate})`);
      }
    });
    
    if (summary.failed > 0) {
      console.log(`\n❌ Проваленные тесты:`);
      testResults
        .filter(r => r.status === TEST_STATUS.FAILED)
        .forEach(r => {
          console.log(`   - ${r.testName}`);
          if (r.errors.length > 0) {
            console.log(`     Ошибка: ${r.errors[0]}`);
          }
        });
    }
    
    console.log('\n' + '='.repeat(50));
  }
}