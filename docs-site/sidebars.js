/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: '🚀 Начало работы',
      items: [
        'intro',
        'quick-start',
        'installation',
        'configuration',
      ],
    },
    {
      type: 'category',
      label: '📚 Руководства',
      items: [
        'guides/deployment',
        'guides/security',
        'guides/performance',
        'guides/testing',
      ],
    },
    {
      type: 'category',
      label: '🧩 Компоненты',
      items: [
        'components/overview',
        'components/hero-section',
        'components/roi-calculator',
        'components/admin-panel',
        'components/ai-assistant',
      ],
    },
    {
      type: 'category',
      label: '🔌 API',
      items: [
        'api/overview',
        'api/authentication',
        'api/endpoints',
        'api/webhooks',
      ],
    },
    {
      type: 'category',
      label: '🛠️ Разработка',
      items: [
        'development/setup',
        'development/coding-standards',
        'development/git-workflow',
        'development/contributing',
      ],
    },
    {
      type: 'category',
      label: '🚨 Устранение неполадок',
      items: [
        'troubleshooting/common-issues',
        'troubleshooting/faq',
        'troubleshooting/support',
      ],
    },
  ],
};

module.exports = sidebars;