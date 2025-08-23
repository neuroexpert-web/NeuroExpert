'use client';

import AdvancedROICalculator from '../components/AdvancedROICalculator';
import styles from './page.module.css';

export default function ROIProPage() {
  return (
    <div className={styles.page}>
      <AdvancedROICalculator />
    </div>
  );
}