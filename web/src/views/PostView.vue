<template lang="pug">
  div.post-view(v-if="post")
    div.card
      header
        h2.post-title {{ post.title }}
        div.post-meta
          span {{ timeToString(post.date, true) }}
          span 分类：{{ post.category }}
          span(v-for="tag in post.tags") #
            router-link(:to="'/tag/' + tag") {{ tag }}
        //- div.post-meta
      article.post-content(v-html="post.content")
    reply(:replies="post.replies")
</template>

<script>
import Reply from '../components/Reply.vue';

import config from '../config';
import timeToString from '../utils/timeToString';

export default {
  name: 'post-view',
  components: { Reply },
  computed: {
    post: function () { return this.$store.state.post; }
  },
  data () {
    return {
      extraDoms: [],
    }
  },
  watch: {
    post: function (post) {
      document.title = `${post.title || 'Loading...'} - ${config.title}`;
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

      })
    }
  },
  beforeDestroy () {
    this.extraDoms.forEach(el => el.remove());
  },
  methods: {
    timeToString
  },
  asyncData ({ store, route }) {
    store.dispatch('fetchPostBySlug', route.params.slug);
  }
};

</script>

<style lang="scss">
div.post-view {
  margin: 15px;
  
  > div.card {
    padding: 1em;
  }

  h2.post-title {
    font-size: 1.25em;
    font-weight: normal;
    margin-top: .25em;
  }

  div.post-meta {
    font-size: 0.9em;
    line-height: 1.5em;
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
