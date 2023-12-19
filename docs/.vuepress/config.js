module.exports = {
  title: 'Me',
  description: 'Official blog theme for VuePress',
  theme: '@ajiu9/vuepress-theme-blog',
  themeConfig: {
    docsDir: 'docs',
    editLinks: true,
    editLinkText: 'Edit this page on GitHub',
    nav: [
      { text: 'Guide', link: '/' },
      { text: 'Config', link: '/config/' },
    ],
    sidebarDepth: 3,
    sidebar: {
      '/config/': [
        '',
        'front-matter',
        'palette'
      ],
    },
    smoothScroll: true,
  },
}

