const config = {
  database: 'mongodb://localhost:27017/newBlog?autoReconnect=false',
  port: 1234,
  favicon: null,
  title: 'ntzyz\'s space',
  subtitle: '∠( ᐛ 」∠)_',
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
    }
  }
};

module.exports = config;
