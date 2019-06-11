<template lang="pug">
  .page-view
    .card
      h3.title {{ page.title }}
      article.page-content(v-html="page.content", @click="linkEventHandler")
    reply(:replies="page.replies || []", api-path="page", :refresh-replies="refreshReplies")
</template>

<script>
import Reply from '../components/Reply.vue';
import config from '../config.json';
import clickEventMixin from '../utils/link-injector';

export default {
  name: 'PageView',
  components: { Reply },
  mixins: [clickEventMixin],
  computed: {
    page () {
      return this.$store.state.page;
    }
  },
  title () { return this.page.title; },
  openGraph () {
    return {
      description: this.page.content.replace(/<(?:.|\n)*?>/gm, '').substr(0, 50) + '...',
      image: this.page.cover,
    };
  },
  watch: {
    '$route': function (route) {
      return this.$store.dispatch('fetchPageBySlug', route.params.slug);
    },
    page (page) {
      if (page && page.title) {
        document.title = `${page.title} - ${config.title}`;
      }
    }
  },
  asyncData({ route, store, redirect }) {
    return store.dispatch('fetchPageBySlug', route.params.slug);
  },
  methods: {
    refreshReplies () {
      this.$store.dispatch('fetchPageBySlug', this.$route.params.slug);
    }
  }
};
</script>


<style lang="scss">
.page-view {
  article.page-content {
    padding: 15px;
  }
}
</style>
