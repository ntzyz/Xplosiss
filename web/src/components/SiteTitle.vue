<template lang="pug">
  header.title
    router-link(to="/"): h1 {{ title }}
    h2 {{ subtitle }}
</template>

<script>
import config from '../config';

export default {
  name: 'site-title',
  data () {
    return {
      title: config.title,
      subtitle: config.subtitle,
    }
  }
};
</script>

<style lang="scss">
header.title {
  text-align: center;
  h1, h2 {
    font-weight: normal;
  }
  h1 {
    font-size: 2em;
  }
  h2 {
    font-size: 20px;
  }
}
</style>