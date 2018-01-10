<template lang="pug">
  div.latest-replies.card
    h3.title Recent replies
    div.content
      ul(v-if="replies !== null")
        li(v-for="reply in replies")
          router-link(:to="(reply.path === 'post' ? '/post/' : '/') + encodeURIComponent(reply.slug)") {{ reply.replies.user }} 发表于「{{ reply.title }}」
      span(v-else) 暂无评论
</template>

<script>
export default {
  name: 'LatestReplies',
  computed: {
    replies: function () { return this.$store.state.replies; }
  },
  asyncData ({ store, route }) {
    return store.dispatch('fetchLatestReplies');
  }
};
</script>

<style lang="scss">
div.latest-replies {
  .content {
    font-size: 0.9em;
    padding: 1em;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    li:not(:first-child) {
      margin-top: 0.5em;
    }
  }
}
</style>
