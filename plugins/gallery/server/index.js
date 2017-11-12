function pluginInstaller ({ site, utils }) {
  site.get('/api/gallery', (req, res) => {
    res.send({
      status: 'ok',
      images: [
        {
          cover: '/api/media/fig-1.jpg',
          title: 'SwagRocket555',
          description: 'Active speed brake controller for model rocket target altitude competition',
          tags: [],
        }, 
        {
          cover: '/api/media/fig-3-3.jpg',
          title: 'n00b',
          description: 'Handle Jog for Computers',
          tags: ['USB', 'ELECTRONICS', 'HMI', 'EMBEDDED'],
        }, 
        {
          cover: '/api/media/fig-27.jpg',
          title: 'Robocart',
          description: '这是一张测试图片',
          tags: [],
        },
        {
          cover: '/api/media/WIN_20160502_21_54_45_Pro.webp',
          title: 'Frontier Exploration with ROS+Turtlebot',
          description: '这是一张测试图片',
          tags: [],
        },
      ]
    });
  });
}

module.exports = pluginInstaller;
