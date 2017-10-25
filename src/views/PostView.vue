<template lang="pug">
  div.post-view(v-if="post")
    div.card
      img(v-if="post.cover" :src="post.cover" style="width: 100%;")
      .content
        header
          h2.post-title {{ post.title }}
          div.post-meta
            span {{ timeToString(post.date, true) }}
            span 分类：{{ post.category }}
            span(v-for="tag in post.tags")
              router-link(:to="'/tag/' + tag") \#{{ tag }}
        article.post-content(v-html="post.content")
    reply(:replies="post.replies", api-path="post", :refresh-replies="refreshReplies")
</template>

<script>
import Reply from '../components/Reply.vue';

import config from '../config';
import timeToString from '../utils/timeToString';
import titleMixin from '../utils/title';

export default {
  name: 'post-view',
  mixins: [titleMixin],
  components: { Reply },
  computed: {
    post () { return this.$store.state.post; },
  },
  title () { return this.post.title; },
  data () {
    return {
      extraDoms: [],
    };
  },
  watch: {
    post: function (post) {
      document.title = `${post.title || 'Loading...'} - ${config.title}`;
      this.$nextTick(() => {
        let componentRoot = document.querySelector('div.post-view');
        this.$nextTick(() => {
          let scripts = Array.from(componentRoot.querySelectorAll('script'));
          if (scripts.length === 0) return;

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
    '$route': function (route) {
      this.$store.dispatch('fetchPostBySlug', route.params.slug);
    }
  },
  beforeDestroy () {
    this.extraDoms.forEach(el => el.remove());
  },
  methods: {
    timeToString,
    refreshReplies () {
      this.$store.dispatch('fetchPostBySlug', this.$route.params.slug);
    }
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
    margin-top: 1em;
    margin-bottom: 1em;
  }

  article > *:first-child {
    margin-top: 0;
  }

  article > *:last-child {
    margin-bottom: 0;
  }

  div.post-meta > span {
    margin-right: 20px;
    color: #333;
  }

  p.indent {
    text-indent: 2em;
  }
}
</style>
