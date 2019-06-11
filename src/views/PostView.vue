<template lang="pug">
  div.post-view(v-if="post")
    div.card
      div.cover-image(v-if="post.cover && !post.insertCover" v-bind:style="{ backgroundImage: `url(${ post.cover })` }")
        div.placeholder
        header.image-overlay
          router-link(:to="'/post/' + post.slug"): h2.post-title {{ post.title }}
          div.post-meta
            span {{ timeToString(post.date, true) }}
            span 分类：{{ post.category }}
            span(v-for="tag in post.tags") #
              router-link(:to="'/tag/' + tag") {{ tag }}
      .content
        header(v-if="!post.cover || post.insertCover")
          h2.post-title {{ post.title }}
          div.post-meta
            span {{ timeToString(post.date, true) }}
            span 分类：{{ post.category }}
            span(v-for="tag in post.tags")
              router-link(:to="'/tag/' + tag") \#{{ tag }}
        article.post-content(v-if="post.cover && post.insertCover")
          img(:src="post.cover" style="width: 100%;")
        article.protect-article.post-content(v-if="post.protected")
          div 这是一个受密码保护的文章。要查看该文章，请提供密码：
          div(v-if="wrongPassword" style="color: #a00") 提供的密码不正确。
          div(style="display: inline-block;")
            input(type="password" v-model="password")
            br
            button(@click="refreshWithPassword()" style="float: right") 提交
        article.post-content(v-else v-html="post.content" @click="linkEventHandler")
    reply(:replies="post.replies || []", api-path="post", :refresh-replies="refreshReplies")
</template>

<script>
import Reply from '../components/Reply.vue';

import config from '../config.json';
import timeToString from '../utils/timeToString';
import titleMixin from '../utils/title';
import clickEventMixin from '../utils/link-injector';

export default {
  name: 'PostView',
  components: { Reply },
  mixins: [titleMixin, clickEventMixin],
  title () { return this.post ? this.post.title : 'Loading...'; },
  data () {
    return {
      extraDoms: [],
      password: '',
      wrongPassword: false,
    };
  },
  computed: {
    post () { return this.$store.state.post; },
  },
  openGraph () {
    let img = this.post.cover;
    if (!img) {
      const imgs = this.post.content.match(/<img ([^>]+?)>/);
      if (imgs && imgs[1]) {
        img = imgs[1].match(/src=\"([^"]+?)\"/);
        if (img && img[1]) {
          img = img[1];
        }
      }
    }
    return {
      description: this.post.content.replace(/<(?:.|\n)*?>/gm, '').replace(/[\n\t\r]/g, '').replace(/\"/g, '&quot;').substr(0, 100) + '...',
      image: img,
    };
  },
  watch: {
    post (post) {
      document.title = `${post.title || 'Loading...'} - ${config.title}`;
    },
    '$route': function (route) {
      this.$store.dispatch('fetchPostBySlug', { slug: route.params.slug, preferLanguage: route.query['prefer-language'] });
    }
  },
  asyncData ({ store, route }) {
    return store.dispatch('fetchPostBySlug', { slug: route.params.slug, preferLanguage: route.query['prefer-language'] });
  },
  beforeDestroy () {
    this.extraDoms.forEach(el => el.remove());
  },
  mounted () {
    this.injectScripts();
  },
  methods: {
    timeToString,
    refreshReplies () {
      this.$store.dispatch('fetchPostBySlug', { slug: this.$route.params.slug, password: this.password, preferLanguage: this.$route.query['prefer-language'] });
    },
    refreshWithPassword () {
      this.$store.dispatch('fetchPostBySlug', { slug: this.$route.params.slug, password: this.password, preferLanguage: this.$route.query['prefer-language'] }).then(() => {
        this.wrongPassword = false;
        if (this.post.protected) {
          this.wrongPassword = true;
        }
      });
    },
    injectScripts () {
      this.$nextTick(() => {
        let componentRoot = this.$el;
        this.$nextTick(() => {
          let scripts = Array.from(componentRoot.querySelectorAll('script'));
          if (scripts.length === 0) return;

          console.log(`Script to inject: ${scripts.length}`);
          scripts.forEach(script => {
            let clone = document.createElement('SCRIPT');
            if (script.getAttribute('src')) {
              clone.setAttribute('src', script.getAttribute('src'));
            } else {
              clone.innerHTML = script.innerHTML;
            }
            componentRoot.appendChild(clone);
            this.extraDoms.push(clone);
          });
          
          this.$store.commit('enableForceReload');
        });
      });
    },
  }
};

</script>

<style lang="scss">
div.post-view {
  > div.card {
    padding: 0em;
    .content {
      padding: 20px;
    }
  }

  h2.post-title {
    font-size: 1.25em;
    font-weight: normal;
    margin-top: .25em;
  }

  div.post-meta {
    font-size: 0.9em;
    line-height: 1.5em;
    word-wrap: break-word;
    word-break: break-all;
  }

  article.post-content {
    padding: 0 1em 0 1em;
  }

  article {
    line-height: 1.5em;
    margin-bottom: 1em;
  }

  article:not(:first-child) {
    margin-top: 1em;
  }

  article > *:first-child {
    margin-top: 0;
  }

  article > *:last-child {
    margin-bottom: 0;
  }

  div.post-meta > span {
    margin-right: 20px;
  }

  header:not(.image-overlay) div.post-meta > span {
    color: #333;
  }

  p.indent {
    text-indent: 2em;
  }

  header.image-overlay {
    padding: 20px;
    box-sizing: border-box;
    // position: absolute;
    bottom: 0px;
    background: linear-gradient(to bottom, rgba(black, 0), rgba(black, 0.5));
    width: 100%;
    div.post-meta > span {
      color: #fff;
    }
    * {
      $shadow-color: #333;
      color: #fff;
      text-shadow: $shadow-color 1px 0px 1px, $shadow-color 0px 1px 1px, $shadow-color 0px -1px 1px, $shadow-color -1px 0px 1px;
    }
  }
  
  div.cover-image {
    display: block;
    position: relative;
    background-size: cover;
    background-position: center;
    width: 100%;
    > * {
      display: inline-block;
      vertical-align: bottom;
    }
  }

  div.placeholder {
    padding-top: 30%;
  }

  article.protect-article {
    input {
      margin: 1em 0;
      width: 200px;
      padding: 5px;
      font-size: 12px;
      // margin-right: 1em;
    }

    input:focus, textarea:focus {
      outline: none;
    }

    input, textarea {
      border: none;
      border-radius: 0;
      border: 1px solid #888888;
      background: rgba(0, 0, 0, 0);
    }
  }
}
</style>
