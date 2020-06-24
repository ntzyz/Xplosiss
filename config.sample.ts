const config = {
  database: { 
    address: 'mongodb://localhost:27017/',
    db: 'newBlog',
  },
  port: 1234,
  favicon: './static/favicon.png', // local file path
  avatar: 'https://github.com/ntzyz.jpg', // http/https url
  title: 'ntzyz\'s space',
  subtitle: '∠( ᐛ 」∠)_',
  footer: [
    'Copyright © 2016-2019 ntzyz. All rights reversed.',
    'Except where otherwise noted, content on this blog is licensed under CC-BY 2.0.'
  ],
  url: 'https://new.ntzyz.cn', // no slash at the end of url
  language: 'zh-CN',
  components: {
    title: true,
    categories: true,
    tags: true,
    replies: true
  },
  meta: {
    themeColor: '#FFFFFF'
  },
  page: {
    size: 5,
  },
  reply: {
    enableMarkdownSupport: true,
  },
  allowedOrigins: [
    'https://example.ntzyz.cn',
    'http://example2.ntzyz.cn',
  ],
  plugins: {
    gallery: {
      enabled: true,
      mountPoint: '/projects',
      title: 'Projects'
    },
    'rss-feed': {
      enabled: true,
    },
    'navigation-sound': {
      enabled: true,
      audioURL: '/Windows%20Navigation%20Start.aac',
    },
    'telegram-helper': {
      enabled: false,
      ownerId: 123456,
      telegramBotToken: 'your bot token here',
    },
    statistics: {
      enabled: false,
      enableBrowserIdentifier: false,
      respectDNT: false,
    },
  }
};

export default config;
