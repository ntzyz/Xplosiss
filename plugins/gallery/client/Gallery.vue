<template lang="pug">
  div Hello World
</template>

<script>
export default {
  name: 'gallery',
  mounted () {
    this.$store.commit('setBusy', false);
  }
};
</script>

<style lang="scss">

</style>
