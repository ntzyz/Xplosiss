<template lang="pug">
  div#app
    div#left
      div#left-wrapper
        router-view(name="sidebar")
    #right
      loading-icon(v-if="busy")
      transition(name="forward"): router-view(v-show="!busy")
</template>

<script>
import LoadingIcon from './components/LoadingIcon.vue';
import config from './config.json';

export default {
  name: 'app',
  data () {
    return {
      transitionName: 'forward',
      lastScrollY: null,
    };
  },
  openGraph () {
    let og = {
      site_name: config.title,
      type: 'website',
      url: config.url + this.$router.resolve(this.$router.currentRoute).href,
    };

    return og;
  },
  components: {
    LoadingIcon
  },
  computed: {
    busy: function () { return this.$store.state.busy; }
  },
  watch: {
    '$route': function () {
      if (typeof document !== 'undefined') {
        document.querySelector('#left-wrapper').setAttribute('style', '');
      }
    }
  },
  mounted () {
    this.lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      if (window.innerWidth <= 800) {
        document.querySelector('#left-wrapper').setAttribute('style', '');
        return;
      };

      let isScrollingDown = (window.scrollY > this.lastScrollY);
      let left = document.querySelector('#left-wrapper');
      let bounding = left.getBoundingClientRect();
      left.parentNode.style.height = `${bounding.height}px`;

      if (bounding.height < window.innerHeight) {
        document.querySelector('#left-wrapper').setAttribute('style', 'position: fixed');
        return;
      }

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
};
</script>

<style lang="scss">
@import './style/global.scss';

body {
  margin: 0;
  color: $font_color;
  min-height: 100vh;
  height: 100%;
  overflow-y: scroll;
  background-color: $background_color;
  font-family: Microsoft Yahei UI;
}

#app {
  max-width: 1280px;
  padding: 0 1em 0 1em;
  margin: 0 auto;
}

@media screen and (min-width: 800px) {
  #app {
    display: flex;
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
    padding: 0 4px 0 4px;
  }
}

@media screen and (max-width: 800px) {
  #app {
    display: block;
    padding: 0;
  }

  #left {
    width: 100%;
  }

  .hide-on-mobile {
    display: none;
  }
}

@import './style/custom.scss';
</style>
