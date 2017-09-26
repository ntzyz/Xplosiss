<template lang="pug">
  div.card.page-view
    h3.title {{ page.title }}
    article.content(v-html="page.content")
</template>

<script>
import config from '../config';

export default {
  name: 'page-view',
  computed: {
    page () {
      return this.$store.state.page;
    }
  },
  watch: {
    page (page) {
      if (page && page.title) {
        document.title = `${page.title} - ${config.title}`;
      }
    }
  },
  asyncData({ route, store }) {
    return store.dispatch('fetchPageBySlug', route.params.slug)
  }
}
</script>


<style lang="scss">
div.card.page-view {
  article.content {
    padding: 15px;
  }
}
</style>
