<template lang="pug">
  div.posts-list
    div.list-item.card(v-for="post in posts")
      img(v-if="post.cover" :src="post.cover" style="width: 100%;")
      div.content
        header
          router-link(:to="'/post/' + post.slug"): h2.post-title {{ post.title }}
          div.post-meta
            span {{ timeToString(post.date, true) }}
            span 分类：{{ post.category }}
            span(v-for="tag in post.tags") #
              router-link(:to="'/tag/' + tag") {{tag}}
        article.post-preview(v-html="post.content")
        footer(v-if="post.more")
          router-link(:to="'/post/' + post.slug").button.more MORE
    pagination(v-if="$store.state.pages", :current="$store.state.pages.current", length="7", :max="$store.state.pages.max", :prefix="prefix")
</template>

<script>
import Pagination from '../components/Pagination.vue';

import config from '../config.json';
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
      }
      return '';
    }
  },
  title () {
    const route = this.$route;
    if (route.params.category) {
      return `分类：${route.params.category}`;
    } else if (route.params.tag) {
      return `标签：${route.params.tag}`;
    }
    return '首页';
  },
  openGraph () {
    const route = this.$route;
    let og = {};
    if (route.params.category) {
      og.description = `查看${route.params.category}分类下的所有文章`;
    } else if (route.params.tag) {
      og.description = `查看${route.params.tag}标签下的所有文章`;
    } else {
      og.description = '全部文章';
    }
    return og;
  },
  watch: {
    '$route': function () {
      this.$options.asyncData({store: this.$store, route: this.$route });
    }
  },
  methods: {
    timeToString
  },
  asyncData ({ store, route }) {
    if (route.params.category) {
      return store.dispatch('fetchPostsByCategory', { category: route.params.category, page: route.params.page });
    } else if (route.params.tag) {
      return store.dispatch('fetchPostsByTag', { tag: route.params.tag, page: route.params.page });
    } else {
      return store.dispatch('fetchLatestPosts', { page: route.params.page });
    }
  }
};
</script>

<style lang="scss">

div.posts-list {
  > ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  div.list-item.card {
    padding: 0;
    .content {
      padding: 20px;
    }
  }

  h2.post-title {
    font-size: 1.25em;
    font-weight: normal;
    margin-top: 0;
  }

  .list-item {
    padding: 20px;
    background-color: white;
    border-radius: 2px;
  }

  div.post-meta {
    font-size: 0.9em;
    line-height: 1.5em;
    word-wrap: break-word;
    word-break: break-all;
  }

  article.post-preview {
    padding: 0 1em;
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

  footer {
    height: 28px;
    a.more {
      font-size: 14px;
      float: right;
      margin-right: 2em;
    }
  }
}
</style>