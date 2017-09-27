<template lang="pug">
  div.latest-replies.card
    h3.title Recent replies
    p.content
      ul(v-if="replies.length !== 0"): li(v-for="reply in replies"): router-link(:to="'/post/' + reply.slug") {{ reply.replies.user }} 发表于「{{ reply.title }}」
      span(v-else) 暂无评论
</template>

<script>
export default {
  name: 'latest-replies',
  computed: {
    replies: function () { return this.$store.state.replies; }
  },
  asyncData ({store, route}) {
    return store.dispatch('fetchLatestReplies');
  }
}
</script>

<style lang="scss">
div.latest-replies {
  .content {
    font-size: 0.9em;
    margin: 1em;
  }
  ul {
    list-style: none;
    padding: 0;
    li:not(:first-child) {
      margin-top: 0.5em;
    }
  }
}
</style>
