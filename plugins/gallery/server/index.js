function pluginInstaller ({ site, utils }) {
  site.get('/api/gallery', (req, res) => {
    res.send({
      status: 'ok',
      pictures: [
        {
          cover: '/api/media/1505993492252-03.png',
          title: '测试图片',
          description: '这是一张测试图片',
          tags: [],
        }
      ]
    });
  });
}

module.exports = pluginInstaller;
