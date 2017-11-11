const config = {
  database: 'mongodb://localhost:27017/newBlog?autoReconnect=false',
  port: 1234,
  favicon: null,
  title: 'ntzyz\'s space"',
  subtitle: '∠( ᐛ 」∠)_',
  url: 'http://ntzyz-vm:1234/',
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
  }
};

module.exports = config;
