<template lang="pug">
  div.widgets
    div.card(v-for="widget in widgets")
      h3.title {{ widget.title }}
      div.content(v-html="widget.content" @click="linkEventHandler")
</template>

<script>
import clickEventMixin from '../utils/link-injector';

export default {
  name: 'widgets',
  mixins: [clickEventMixin],
  computed: {
    widgets: function () { return this.$store.state.widgets; }
  },
  asyncData ({ store, route }) {
    return store.dispatch('fetchWidget');
  }
};
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

  .content {
    padding: 1em;
  }
}
</style>
