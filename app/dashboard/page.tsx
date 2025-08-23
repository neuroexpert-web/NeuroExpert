'use client';

import MetricsDashboard from '../components/MetricsDashboard';
import styles from './page.module.css';

export default function DashboardPage() {
  return (
    <div className={styles.page}>
      <MetricsDashboard />
    </div>
  );
}