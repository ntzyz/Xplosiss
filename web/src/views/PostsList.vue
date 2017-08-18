<template lang="pug">
  div.posts-list
    ul
      li.list-item(v-for="post in posts")
        header
          router-link(:to="'/post/' + post.slug"): h2.post-title {{ post.title }}
          div.post-meta
            span {{ timeToString(post.date, true) }}
            span 分类：{{ post.category }}
            span(v-for="tag in post.tags") #
              router-link(:to="'/tag/' + tag") {{tag}}
        article.post-preview(v-html="post.content")
        footer
          router-link(:to="'/post/' + post.slug"): button.more MORE
    pagination(v-if="$store.state.pages", :current="$store.state.pages.current", length="10", :max="$store.state.pages.max", :prefix="prefix")
</template>

<script>
import Pagination from '../components/Pagination.vue';

import config from '../config';
import timeToString from '../utils/timeToString';

export default {
  name: 'posts-list',
  components: { Pagination },
  computed: {
    posts: function () { return this.$store.state.posts; },
    prefix: function () {
      let route = this.$route;
      if (route.params.category) {
        return `/category/${route.params.category}`;
      } else if (route.params.tag) {
        return `/tag/${route.params.tag}`;
      } else {
        return ``;
      }
    }
  },
  watch: {
    '$route': function () {
      this.$options.asyncData({store: this.$store, route: this.$route });
    }
  },
  methods: {
    timeToString
  },
  asyncData ({store, route}) {
    if (route.params.category) {
      document.title = `分类：${route.params.category} - ${config.title}`;
      store.dispatch('fetchPostsByCategory', { category: route.params.category, page: route.params.page });
    } else if (route.params.tag) {
      document.title = `标签：${route.params.tag} - ${config.title}`;
      store.dispatch('fetchPostsByTag', { tag: route.params.tag, page: route.params.page });
    } else {
      document.title = `首页 - ${config.title}`;
      store.dispatch('fetchLatestPosts', { page: route.params.page });
    }
  }
}
</script>

<style lang="scss">

div.posts-list {
  > ul {
    padding: 0;
    list-style: none;
  }

  h2.post-title {
    font-size: 1.25em;
    font-weight: normal;
    margin-top: 0;
  }

  li.list-item {
    margin-top: 15px;
    padding-top: 15px;
    margin-bottom: 15px;
    padding-bottom: 15px;
  }

  li.list-item:not(:last-child) {
    border-bottom: 1px solid grey;
  }

  div.post-meta {
    font-size: 0.9em;
    line-height: 1.5em;
  }

  article.post-preview {
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
    color: #ccc;
  }

  footer {
    button {
      font-size: 12px;
      margin-left: 1em;
      padding: 0em 1.2em 0em 1.2em;
    }
  }
}
</style>