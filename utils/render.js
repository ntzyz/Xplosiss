const pug = require('pug');
const hljs = require('highlight.js');
const config = require('../config');
const mdit = require('markdown-it');

function addSpanEachLine (html) {
  return html.split('\n').map(l => `<span class="__line">${l}</span>`).join('\n');
}

function render (posts, options) {
  const acceptLanguage = options.acceptLanguage || 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7,ja;q=0.6';

  return posts.map(origPost => {
    let post = JSON.parse(JSON.stringify(origPost));
    post.date = new Date(post.date);

    // Get all available languages.
    const availableLanguages = post.body.map(body => {
      const matchedOffset = acceptLanguage.indexOf(body.language);
      const priority = (matchedOffset >= 0) ? (acceptLanguage.length - acceptLanguage.indexOf(body.language)) : -1;
      return {
        name: body.language,
        priority,
      };
    }).sort((a, b) => b.priority - a.priority);

    let matchedBody = null;
    if (availableLanguages[0].priority < 0) {
      // Nobody matched, use default;
      matchedBody = post.body.filter(body => body.default)[0];
    } else {
      // use language which has max priority
      matchedBody = post.body.filter(body => body.language === availableLanguages[0].name)[0];
    }

    if (!options.fakeRendering) {
      if (/^markdown$/i.test(matchedBody.format)) {
        // Markdown-it can do it cleanly.
        if (options.preview && matchedBody.content.indexOf('<!-- more -->') >= 0) {
          post.content = matchedBody.content.substr(0, matchedBody.content.indexOf('<!-- more -->'));
          post.more = true;
        } else {
          post.content = matchedBody.content;
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
        if (/^(jade|pug)$/i.test(matchedBody.format)) {
          post.content = pug.render(matchedBody.content);
        } else {
          post.content = matchedBody.content;
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
    }

    // Finally, remove original source & add title
    post.title = matchedBody.title;
    delete post.body;

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
