<template lang="pug">

</template>

<script>
import config from '../config.json';

export default {
  name: 'SiteTitle',
  data () {
    return {
      title: config.title,
      subtitle: config.subtitle,
    };
  }
};
</script>

<style lang="scss">


</style>