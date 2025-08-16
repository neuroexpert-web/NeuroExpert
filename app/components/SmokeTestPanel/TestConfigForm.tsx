import React from 'react';
import { TestConfig } from './types';

interface TestConfigFormProps {
  config: TestConfig;
  onConfigChange: (config: TestConfig) => void;
}

export default function TestConfigForm({ 
  config, 
  onConfigChange 
}: TestConfigFormProps): JSX.Element {
  const handleChange = (field: keyof TestConfig, value: any) => {
    onConfigChange({
      ...config,
      [field]: value
    });
  };

  const handleViewportChange = (dimension: 'width' | 'height', value: number) => {
    onConfigChange({
      ...config,
      viewport: {
        ...config.viewport,
        [dimension]: value
      }
    });
  };

  const browsers = ['chrome', 'firefox', 'safari', 'edge'] as const;
  const presetViewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 },
    { name: '4K', width: 3840, height: 2160 }
  ];

  return (
    <div className="test-config-form">
      <h3>Test Configuration</h3>
      
      <div className="config-section">
        <label>Browser</label>
        <select 
          value={config.browser}
          onChange={(e) => handleChange('browser', e.target.value)}
        >
          {browsers.map(browser => (
            <option key={browser} value={browser}>
              {browser.charAt(0).toUpperCase() + browser.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="config-section">
        <label>Viewport</label>
        <div className="viewport-inputs">
          <input
            type="number"
            placeholder="Width"
            value={config.viewport.width}
            onChange={(e) => handleViewportChange('width', Number(e.target.value))}
          />
          <span>×</span>
          <input
            type="number"
            placeholder="Height"
            value={config.viewport.height}
            onChange={(e) => handleViewportChange('height', Number(e.target.value))}
          />
        </div>
        <div className="viewport-presets">
          {presetViewports.map(preset => (
            <button
              key={preset.name}
              className="preset-btn"
              onClick={() => onConfigChange({
                ...config,
                viewport: { width: preset.width, height: preset.height }
              })}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="config-section">
        <label>Base URL</label>
        <input
          type="url"
          value={config.baseUrl}
          onChange={(e) => handleChange('baseUrl', e.target.value)}
          placeholder="https://example.com"
        />
      </div>

      <div className="config-section">
        <label>Timeout (ms)</label>
        <input
          type="number"
          value={config.timeout}
          onChange={(e) => handleChange('timeout', Number(e.target.value))}
          min="1000"
          step="1000"
        />
      </div>

      <div className="config-section">
        <label>Retries on Failure</label>
        <input
          type="number"
          value={config.retries}
          onChange={(e) => handleChange('retries', Number(e.target.value))}
          min="0"
          max="5"
        />
      </div>
    </div>
  );
}