<template lang="pug">
  div.widgets
    ul
      li(v-for="widget in widgets")
        h3 {{ widget.title }}
        p(v-html="widget.content")
</template>

<script>
export default {
  name: 'widgets',
  computed: {
    widgets: function () { return this.$store.state.widgets }
  },
  asyncData ({ store, route }) {
    return store.dispatch('fetchWidget');
  }
}
</script>

<style lang="scss">
div.widgets {
  ul {
    list-style: none;
    padding: 0;
  }

  li {
    display: block;
    font-size: 1em;
    line-height: 1.5em;
  }

  p {
    margin: 0;
    padding-left: 1em;
  }
}
</style>
