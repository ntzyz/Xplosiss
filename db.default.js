/*global db*/
/*eslint no-undef: 'error'*/

db.posts.remove({});
db.posts.insertMany([{
  'slug': 'hello-world',
  'category': 'Default',
  'date': new Date(0),
  'tags': ['HelloWorld'],
  'body': [
    {
      'title': 'Hello World',
      'content': '<p>欢迎使用 Xplosiss。这是您的第一篇文章。编辑或删除它，然后开始写作吧！</p>',
      'format': 'HTML',
      'language': 'zh',
      'default': true
    }
  ],
  'replies': [{
    'user': '一位 Xplosiss 评论者',
    'email': '',
    'site': 'https://github.com/ntzyz/new-blog',
    'content': '嗨，这是一条评论。\n\n要开始审核、编辑及删除评论，请访问仪表盘的“评论”页面。\n\n评论者没有头像。',
    'datetime': 0
  }]
}]);

db.widgets.remove({});
db.widgets.insertMany([{
  'title': 'Hi',
  'content': '这是一个小工具，你可以在这里放任意 HTML 文本，比如友情链接，或是自我介绍。',
  'enabled': true
}]);

db.pages.remove({});
db.pages.insertMany([{
  'title': 'About Me',
  'slug': 'about-me',
  'content': {
    'encoding': 'markdown',
    'content': '## Hello World\n'
  }
}]);
