'use client';

import { useEffect, useState } from 'react';

export default function TestInteractions() {
  const [testResults, setTestResults] = useState([]);

  const addResult = (test, result) => {
    setTestResults((prev) => [
      ...prev,
      { test, result, timestamp: new Date().toLocaleTimeString() },
    ]);
  };

  useEffect(() => {
    // Log page load
    addResult('Page Load', '✅ Test page loaded successfully');
  }, []);

  const testAIButton = () => {
    const aiButton = document.querySelector('.ai-float-button');
    if (aiButton) {
      addResult('AI Button', '✅ AI button found');
      aiButton.click();
      setTimeout(() => {
        const chatWindow = document.querySelector('.fixed.bottom-24');
        if (chatWindow) {
          addResult('AI Chat Window', '✅ Chat window opened');
        } else {
          addResult('AI Chat Window', '❌ Chat window not found');
        }
      }, 1000);
    } else {
      addResult('AI Button', '❌ AI button not found');
    }
  };

  const testROICalculator = () => {
    const calcSection = document.querySelector('#calculator');
    if (calcSection) {
      addResult('ROI Section', '✅ ROI calculator section found');
      calcSection.scrollIntoView({ behavior: 'smooth' });

      setTimeout(() => {
        const calcButton = document.querySelector('.roi-calculate-button');
        if (calcButton) {
          addResult('ROI Button', '✅ Calculate button found');
          calcButton.click();

          setTimeout(() => {
            const modal = document.querySelector('.roi-modal');
            if (modal) {
              addResult('ROI Modal', '✅ Modal opened successfully');
            } else {
              addResult('ROI Modal', '❌ Modal not found');
            }
          }, 1000);
        } else {
          addResult('ROI Button', '❌ Calculate button not found');
        }
      }, 1500);
    } else {
      addResult('ROI Section', '❌ ROI calculator section not found');
    }
  };

  const testContactForm = () => {
    const contactSection = document.querySelector('#consultation');
    if (contactSection) {
      addResult('Contact Section', '✅ Contact section found');
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      addResult('Contact Section', '❌ Contact section not found');
    }
  };

  const testDemoButton = () => {
    const demoButton = document.querySelector('.btn-luxury');
    if (demoButton) {
      addResult('Demo Button', '✅ Demo button found');
      demoButton.click();
    } else {
      addResult('Demo Button', '❌ Demo button not found');
    }
  };

  return (
    <div style={{ padding: '40px', background: '#0a0a0a', minHeight: '100vh', color: 'white' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '32px' }}>🧪 Interactive Elements Test</h1>

      <div style={{ display: 'grid', gap: '16px', marginBottom: '40px' }}>
        <button
          onClick={testAIButton}
          style={{
            padding: '16px 32px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Test AI Chat Button
        </button>

        <button
          onClick={testROICalculator}
          style={{
            padding: '16px 32px',
            background: 'linear-gradient(135deg, #48bb78, #38a169)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Test ROI Calculator
        </button>

        <button
          onClick={testContactForm}
          style={{
            padding: '16px 32px',
            background: 'linear-gradient(135deg, #ed8936, #dd6b20)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Test Contact Form
        </button>

        <button
          onClick={testDemoButton}
          style={{
            padding: '16px 32px',
            background: 'linear-gradient(135deg, #4299e1, #3182ce)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Test Demo Button
        </button>
      </div>

      <div
        style={{
          background: 'rgba(20, 20, 40, 0.8)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(102, 126, 234, 0.3)',
        }}
      >
        <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Test Results:</h2>
        {testResults.length === 0 ? (
          <p style={{ color: '#666' }}>No tests run yet. Click the buttons above to test.</p>
        ) : (
          <div style={{ display: 'grid', gap: '8px' }}>
            {testResults.map((result, index) => (
              <div
                key={index}
                style={{
                  padding: '12px',
                  background: 'rgba(102, 126, 234, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                }}
              >
                <span style={{ color: '#a0a0a0', fontSize: '12px' }}>{result.timestamp}</span>
                <div>
                  <strong>{result.test}:</strong> {result.result}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: '40px',
          padding: '16px',
          background: 'rgba(237, 137, 54, 0.1)',
          borderRadius: '8px',
        }}
      >
        <p>💡 This test page helps verify that all interactive elements are working properly.</p>
        <p>Open the browser console to see additional debug logs.</p>
      </div>
    </div>
  );
}
