const pug = require('pug');
const hljs = require('highlight.js');
const config = require('../config');
const mdit = require('markdown-it');

function addSpanEachLine (html) {
  return html.split('\n').map(l => `<span class="__line">${l}</span>`).join('\n');
}

function render (posts, options) {
  return posts.map(origPost => {
    let post = JSON.parse(JSON.stringify(origPost));
    post.date = new Date(post.date);
    if (/^markdown$/i.test(post.content.encoding)) {
      // Markdown-it can do it cleanly.
      if (options.preview && post.content.content.indexOf('<!-- more -->') >= 0) {
        post.content = post.content.content.substr(0, post.content.content.indexOf('<!-- more -->'));
        post.more = true;
      } else {
        post.content = post.content.content;
      }
      post.content = mdit({
        html: true,
        highlight: function (str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return `<pre>${addSpanEachLine(hljs.highlight(lang, str.replace(/(\s+$)/g, ''), true).value)}</pre>`;
            } catch (__) {}
          }
          return `<pre>${str}</pre>`;
        }
      }).render(post.content);

      // Render {AAA}(b) as
      //   b
      //  AAA
      post.content = post.content.replace(/{([^\n]+?)}\(([^\n]+?)\)/g, (m, p1, p2) => {
        return `<ruby>${p1}<rp>(</rp><rt>${p2}</rt><rp>)</rp></ruby>`;
      });
    } else {
      // Render other formats (pug, makrdown, etc) into html
      if (/^(jade|pug)$/i.test(post.content.encoding)) {
        post.content = pug.render(post.content.content);
      } else {
        post.content = post.content.content;
      }

      // Cut the post content if we are in preview mode.
      if (options.preview && post.content.indexOf('<!-- more -->') >= 0) {
        post.content = post.content.substr(0, post.content.indexOf('<!-- more -->'));
        post.more = true;
      }

      // Apply syntax highlighting for code blocks.
      post.content = post.content.replace(/<code lang="(.+?)">([^]+?)<\/code>/g, (match, p1, p2) => {
        let rendered = hljs.highlight(p1, p2.replace(/(\s+$)/g, '')).value;
        return `<pre>${addSpanEachLine(rendered)}</pre>`;
      }).replace(/<code>([^]+?)<\/code>/g, (match, p1) => {
        let rendered = hljs.highlightAuto(p1.replace(/(\s+$)/g, '')).value;
        return `<pre>${addSpanEachLine(rendered)}</pre>`;
      });
    }

    if (post.replies && config.reply.enableMarkdownSupport) {
      post.replies = post.replies.map(reply => {
        reply.content = mdit({
          html: false,
          highlight: function (str, lang) {
            if (lang && hljs.getLanguage(lang)) {
              try {
                return `<pre>${addSpanEachLine(hljs.highlight(lang, str.replace(/(\s+$)/g, ''), true).value)}</pre>`;
              } catch (__) {}
            }
            return `<pre>${str}</pre>`;
          }
        }).render(reply.content);
        reply.markdown = true;
        return reply;
      });
    }

    if (/multi-lang/.test(post.content)) {
      let acceptLanguage;

      if (!options.acceptLanguage) {
        acceptLanguage = 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7,ja;q=0.6';
      } else {
        acceptLanguage = options.acceptLanguage;
      }

      // 获取所有的语言
      const langs = [...new Set(post.content.match(/\<multi\-lang\ lang=\"([^\"]+?)\">/ig))].map(matched => {
        const lang = matched.match(/\<multi\-lang\ lang=\"([^\"]+?)\">/i)[1];
        return {
          name: lang,
          priority: acceptLanguage.indexOf(lang) >= 0 ? (acceptLanguage.length - acceptLanguage.indexOf(lang)) : (-1),
        };
      }).sort((a, b) => b.priority - a.priority);

      console.log(langs);

      // 移除最匹配的语言
      langs.shift();

      // 移除剩下的所有语言块
      post.content = post.content.replace(new RegExp('\\<multi\\-lang\\ lang\\=\\"(' + langs.map(l => l.name).join('|') + ')\\"\\>[^]+?\\<\\/multi\\-lang\\>', 'ig'), '');
    }

    return post;
  });
}

module.exports = function () {
  try {
    return render.apply(null, arguments);
  } catch (e) {
    console.log(e);
  }
};
