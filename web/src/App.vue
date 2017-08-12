<template lang="pug">
  div#app
    div#left
      div#left-wrapper
        site-title
        hr
        search
        categories-list
        tags-list
        widgets
    #right
      loading-icon(v-show="busy")
      router-view(v-show="!busy")
      //- transition(:name="transitionName")
</template>

<script>
import SiteTitle from './components/SiteTitle.vue';
import Search from './components/Search.vue';
import CategoriesList from './components/CategoriesList.vue';
import TagsList from './components/TagsList.vue';
import Widgets from './components/Widgets.vue';
import LoadingIcon from './components/LoadingIcon.vue';

export default {
  name: 'app',
  data () {
    return {
      transitionName: 'forward',
      lastScrollY: null,
    }
  },
  components: {
    SiteTitle, Search, CategoriesList, TagsList, Widgets, LoadingIcon
  },
  computed: {
    busy: function () { return this.$store.state.busy; }
  },
  watch: {
    '$route': function () {
      document.querySelector('#left-wrapper').setAttribute('style', '');
    }
  },
  created () {
    this.lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      let isScrollingDown = (window.scrollY > this.lastScrollY);
      let left = document.querySelector('#left-wrapper');
      let bounding = left.getBoundingClientRect();
      left.parentNode.style.height = `${bounding.height}px`;

      if (isScrollingDown) {
        if (left.style.position === 'fixed' && left.style.top === '0px') {
          left.style.position = 'absolute';
          left.style.top = `${window.scrollY + bounding.top}px`;
          left.style.bottom = '';
        } else if (bounding.bottom < window.innerHeight) {
          left.style.position = 'fixed';
          left.style.top = '';
          left.style.bottom = '0px';
        }
      } else {
        if (left.style.position === 'fixed' && left.style.bottom === '0px') {
          left.style.position = 'absolute';
          left.style.top = `${window.scrollY + bounding.top}px`;
          left.style.bottom = '';
        } else if (bounding.top > 0) {
          left.style.position = 'fixed';
          left.style.bottom = '';
          left.style.top = '0px';
        }
      }

      this.lastScrollY = window.scrollY;
    });
  }
}
</script>

<style lang="scss">
@import './style/global.scss';

html {
}

body {
  margin: 0;
  color: $font_color;
  min-height: 100vh;
  height: 100%;
  overflow-y: scroll;
  background-color: $theme_color;
  font-family: Microsoft Yahei UI;
}

#app {
  max-width: 1000px;
  display: flex;
  padding: 0 5px 0 5px;
  margin: 0 auto;
}

#left {
  flex-shrink: 0;
  flex-grow: 0;
  width: 300px;
  height: fit-content;
  padding-right: 25px;
  position: relative;
  div#left-wrapper {
    width: 300px;
    position: absolute;
  }
}

#right {
  flex-grow: 1;
  position: relative;
  overflow: hidden;
}

</style>
