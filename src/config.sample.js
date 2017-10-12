export default {
  title: 'ntzyz\'s space',
  subtitle: '∠( ᐛ 」∠)_',
  api: {
    url: process.env.VUE_ENV === 'server' ? 'https://new.ntzyz.cn/api' : '/api'
  },
  components: {
    title: true,
    categories: true,
    tags: true,
    replies: true
  },
  meta: {
    themeColor: '#FFFFFF'
  }
};
