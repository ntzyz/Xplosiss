<template lang="pug">
  .page-view
    .card
      h3.title {{ page.title }}
      article.content(v-html="page.content")
    reply(:replies="page.replies || []", api-path="page", :refresh-replies="refreshReplies")
</template>

<script>
import Reply from '../components/Reply.vue';
import config from '../config.json';

export default {
  name: 'page-view',
  components: { Reply },
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
  methods: {
    refreshReplies () {
      this.$store.dispatch('fetchPageBySlug', this.$route.params.slug);
    }
  },
  asyncData({ route, store }) {
    return store.dispatch('fetchPageBySlug', route.params.slug);
  }
};
</script>


<style lang="scss">
.page-view {
  article.content {
    padding: 15px;
  }
}
</style>
