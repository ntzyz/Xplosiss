<template lang="pug">

</template>

<script>
import config from '../config';

export default {
  name: 'site-title',
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