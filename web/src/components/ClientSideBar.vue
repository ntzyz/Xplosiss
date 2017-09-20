<template lang="pug">
  div.side-bar
    site-title
    //- hr
    //- search.hide-on-mobile
    categories-list.hide-on-mobile
    tags-list.hide-on-mobile
    widgets.hide-on-mobile
</template>

<script>
import SiteTitle from './SiteTitle.vue';
import Search from './Search.vue';
import CategoriesList from './CategoriesList.vue';
import TagsList from './TagsList.vue';
import Widgets from './Widgets.vue';

export default {
  name: 'client-side-bar',
  components: {
    SiteTitle, Search, CategoriesList, TagsList, Widgets
  }
};

</script>

<style lang="scss">
</style>