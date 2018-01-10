<template lang="pug">
  div.not-found.card
    h2.title Error
    div
      h2 HTTP 404
      p 这里除了好奇什么都没有。
      //- p ここには好奇心だけがあります。
      p There is nothing but curiosity here.
</template>

<script>
import config from '../config.json';

export default {
  name: 'NotFound',
  title () { return 'Error 404'; },
  mounted () {
    this.$store.commit('setBusy', false);
  }
};
</script>

<style lang="scss">
div.not-found {
  div {
    padding-left: 30px;
  }
}
</style>
