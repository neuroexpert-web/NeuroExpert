// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'NeuroExpert Documentation',
  tagline: 'AI-платформа для цифровизации бизнеса',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.neuroexpert.ai',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/docs/',

  // GitHub pages deployment config.
  organizationName: 'neuroexpert',
  projectName: 'neuroexpert-docs',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/neuroexpert/docs/tree/main/',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/neuroexpert/docs/tree/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'NeuroExpert',
        logo: {
          alt: 'NeuroExpert Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Документация',
          },
          {to: '/blog', label: 'Блог', position: 'left'},
          {
            href: 'https://github.com/neuroexpert',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Документация',
            items: [
              {
                label: 'Начало работы',
                to: '/docs/intro',
              },
              {
                label: 'API Reference',
                to: '/docs/api',
              },
            ],
          },
          {
            title: 'Сообщество',
            items: [
              {
                label: 'Telegram',
                href: 'https://t.me/neuroexpert',
              },
              {
                label: 'Discord',
                href: 'https://discord.gg/neuroexpert',
              },
            ],
          },
          {
            title: 'Больше',
            items: [
              {
                label: 'Блог',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/neuroexpert',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} NeuroExpert. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
    }),
};

module.exports = config;