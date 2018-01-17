<template lang="pug">
  div.post-view(v-if="post")
    div.card
      div(v-if="post.cover" style="position: relative;")
        img(:src="post.cover" style="width: 100%;")
        header.image-overlay
          router-link(:to="'/post/' + post.slug"): h2.post-title {{ post.title }}
          div.post-meta
            span {{ timeToString(post.date, true) }}
            span 分类：{{ post.category }}
            span(v-for="tag in post.tags") #
              router-link(:to="'/tag/' + tag") {{ tag }}
      .content
        header(v-if="!post.cover")
          h2.post-title {{ post.title }}
          div.post-meta
            span {{ timeToString(post.date, true) }}
            span 分类：{{ post.category }}
            span(v-for="tag in post.tags")
              router-link(:to="'/tag/' + tag") \#{{ tag }}
        article.post-content(v-html="post.content" @click="linkEventHandler")
    reply(:replies="post.replies", api-path="post", :refresh-replies="refreshReplies")
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
      this.$store.dispatch('fetchPostBySlug', route.params.slug);
    }
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
      this.$store.dispatch('fetchPostBySlug', this.$route.params.slug);
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
  },
  asyncData ({ store, route }) {
    return store.dispatch('fetchPostBySlug', route.params.slug);
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
    position: absolute;
    bottom: 5px;
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

}
</style>
