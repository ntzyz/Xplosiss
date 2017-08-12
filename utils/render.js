const pug = require('pug');
const hljs = require('highlight.js')
const config = require('../config');
const md = require('markdown-it')({
  html: false,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre>${hljs.highlight(lang, str, true).value}</pre>`
      } catch (__) {}
    }
    return `<pre>${md.utils.escapeHtml(str)}</pre>`;
  }
});

function decodeHTML (str) {
    let strMap = {
        '&lt': '<',
        '&gt': '>',
        '&quot': '"',
        '&apos': '\'',
        '&amp': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&apos;': '\'',
        '&amp;': '&'
    };
    if (str.length === 0) {
        return '';
    }
    return str.replace(/&[0-9a-zA-Z]+;?/g, function(s) {
        return strMap[s] || s;
    });
}

function render (posts, options) {
  return posts.map(post => {
    if (/^markdown$/i.test(post.content.encoding)) {
      // Markdown-it can do it cleanly.
      if (options.preview && post.content.indexOf('<!-- more -->') >= 0) {
        post.content = post.content.substr(0, post.content.indexOf('<!-- more -->'));
      }
      post.content = md.render(post.content.content);
    } else {
      let lang = '';
      // Render other formats (pug, makrdown, etc) into html
      if (/^(jade|pug)$/i.test(post.content.encoding)) {
        lang = 'PUG';
        post.content = pug.render(post.content.content);
      } else {
        post.content = post.content.content;
      }

      // Cut the post content if we are in preview mode.
      if (options.preview && post.content.indexOf('<!-- more -->') >= 0) {
        post.content = post.content.substr(0, post.content.indexOf('<!-- more -->'));
      }

      // Apply syntax highlighting for code blocks.
      post.content = post.content.replace(/<code lang="(.+?)">([^]+?)<\/code>/g, (match, p1, p2) => {
        let rendered = hljs.highlight(p1, p2).value;
          return `<pre>${rendered}</pre>`;
      }).replace(/<code>([^]+?)<\/code>/g, (match, p1) => {
        let rendered = hljs.highlightAuto(p1).value;
        return `<pre>${rendered}</pre>`;
      });
    }

    if (post.replies && config.reply.enableMarkdownSupport) {
      post.replies = post.replies.map(reply => {
        reply.content = md.render(reply.content);
        reply.markdown = true;
        return reply;
      })
    }

    return post;
  })
}

module.exports = render;