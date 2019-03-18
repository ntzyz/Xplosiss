<template lang="pug">
  div.posts-list
    div.list-item.card(v-for="post in posts")
      div.cover-image(v-if="post.cover" v-bind:style="{ backgroundImage: `url(${ post.cover })` }")
        div.placeholder
        header.image-overlay
          router-link(:to="'/post/' + post.slug"): h2.post-title {{ post.title }}
          div.post-meta
            span {{ timeToString(post.date, true) }}
            span 分类：{{ post.category }}
            span(v-for="tag in post.tags") #
              router-link(:to="'/tag/' + tag") {{ tag }}
      div.content
        header(v-if="!post.cover")
          router-link(:to="'/post/' + post.slug"): h2.post-title {{ post.title }}
          div.post-meta
            span {{ timeToString(post.date, true) }}
            span 分类：{{ post.category }}
            span(v-for="tag in post.tags") #
              router-link(:to="'/tag/' + tag") {{ tag }}
        article.post-preview(v-if="post.protected") 这是一个受密码保护的文章，请点击下放的更多按钮，并提供密码。
        article.post-preview(v-else v-html="post.content" @click="linkEventHandler")
        footer(v-if="post.more")
          router-link(:to="'/post/' + post.slug").button.more MORE
</template>

<script>
import Pagination from '../components/Pagination.vue';

import config from '../config.json';
import timeToString from '../utils/timeToString';
import clickEventMixin from '../utils/link-injector';

export default {
  name: 'PostsList',
  mixins: [clickEventMixin],
  props: {
    posts: {
      type: Array,
      default () { return []; }
    }
  },
  computed: {
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
  methods: {
    timeToString
  },
};
</script>

<style lang="scss">

</style>