<template lang="pug">
  div.posts-list
    transition(name="forward"): div(:key="title")
      div.title-card.card(v-show="title") {{ title }}
      posts-list(:posts="posts")
      pagination(v-if="$store.state.pages", :current="$store.state.pages.current", :length="7", :max="$store.state.pages.max", :prefix="prefix")
</template>

<script>
import Pagination from '../components/Pagination.vue';
import PostsList from '../components/PostsList.vue';

import config from '../config.json';
import timeToString from '../utils/timeToString';
import clickEventMixin from '../utils/link-injector';

export default {
  name: 'PostsListView',
  components: { Pagination, PostsList },
  mixins: [clickEventMixin],
  data () {
    return { title: null };
  },
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
      this.title = `分类：${route.params.category}`;
      return this.title;
    } else if (route.params.tag) {
      this.title = `标签：${route.params.tag}`;
      return this.title;
    } else {
      this.title = null;
      return '首页';
    }
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
      this.promise = this.$options.asyncData({store: this.$store, route: this.$route });
    }
  },
  asyncData ({ store, route }) {
    if (route.params.category) {
      return store.dispatch('fetchPostsByCategory', { category: route.params.category, page: route.params.page });
    } else if (route.params.tag) {
      return store.dispatch('fetchPostsByTag', { tag: route.params.tag, page: route.params.page });
    } else {
      return store.dispatch('fetchLatestPosts', { page: route.params.page });
    }
  },
  methods: {
    timeToString
  }
};
</script>

<style lang="scss">
@import '../style/global.scss';

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

  footer {
    height: 28px;
    a.more {
      font-size: 14px;
      float: right;
      margin-right: 2em;
    }
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

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
}
</style>