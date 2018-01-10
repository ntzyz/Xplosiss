<template lang="pug">
  div.tags-list.card
    h3.title Tags
    ul
      li(v-for="tag in tags"): router-link(:to="'/tag/' + encodeURIComponent(tag.tag)" :title="tag.count + '篇相关文章'") {{ tag.tag }}
</template>

<script>
export default {
  name: 'TagsList',
  computed: {
    tags: function () { return this.$store.state.tags; }
  },
  asyncData ({store, route}) {
    return store.dispatch('fetchTags');
  }
};
</script>

<style lang="scss">
div.tags-list {
  ul {
    list-style: none;
    padding: 0 0.5em;
  }

  li {
    display: inline-block;
    font-size: 0.8em;
    padding: 0 0.5em;
  }
}
</style>
