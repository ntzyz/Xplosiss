<template lang="pug">
  div.side-bar
    site-title(v-if="components.title")
    //- hr
    //- search.hide-on-mobile
    categories-list.hide-on-mobile(v-if="components.categories")
    tags-list.hide-on-mobile(v-if="components.tags")
    latest-replies.hide-on-mobile(v-if="components.replies")
    widgets.hide-on-mobile
</template>

<script>
import SiteTitle from './SiteTitle.vue';
import Search from './Search.vue';
import CategoriesList from './CategoriesList.vue';
import TagsList from './TagsList.vue';
import Widgets from './Widgets.vue';
import LatestReplies from './LatestReplies.vue';
import config from '../config';

export default {
  name: 'client-side-bar',
  components: {
    SiteTitle, Search, CategoriesList, TagsList, Widgets, LatestReplies
  },
  data () {
    return {
      components: config.components,
    }
  }
};

</script>

<style lang="scss">
</style>