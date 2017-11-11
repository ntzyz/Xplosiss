<template lang="pug">
  div.side-bar(onclick="void(0)")
    header(v-if="components.title").title.card
      svg.drawer-trigger(viewBox="0 0 33.866666 33.866668" @click="showDrawer"): g(transform="translate(0,-263.13332)")
        rect(width="28.965336" height="5.5324793" x="2.4506655" y="277.30042")
        rect(width="28.965336" height="5.5324793" x="2.4506655" y="267.77527")
        rect(width="28.965336" height="5.5324793" x="2.4506655" y="286.82556")
      router-link(to="/"): h1 {{ title }}
      h2 {{ subtitle }}
    //- hr
    //- search.hide-on-mobile
    div.drawer-container(v-bind:class="{ 'active': isDrawerOpen }")
    div.drawer(v-bind:class="{ 'active': isDrawerOpen }")
      categories-list(v-if="components.categories")
      tags-list(v-if="components.tags")
      latest-replies(v-if="components.replies")
      widgets
</template>

<script>
import SiteTitle from './SiteTitle.vue';
import Search from './Search.vue';
import CategoriesList from './CategoriesList.vue';
import TagsList from './TagsList.vue';
import Widgets from './Widgets.vue';
import LatestReplies from './LatestReplies.vue';
import config from '../config.json';

export default {
  name: 'client-side-bar',
  components: {
    SiteTitle, Search, CategoriesList, TagsList, Widgets, LatestReplies
  },
  data () {
    return {
      components: config.components,
      title: config.title,
      subtitle: config.subtitle,
      isDrawerOpen: false
    };
  },
  methods: {
    hideDrawer (e) {
      e.stopPropagation();
      this.isDrawerOpen = false;
      document.removeEventListener('click', this.hideDrawer);
      // document.removeEventListener('touchstart', this.hideDrawer);
    },
    showDrawer (e) {
      if (this.isDrawerOpen) {
        return this.hideDrawer(e);
      }
      e.stopPropagation();
      this.isDrawerOpen = true;
      document.addEventListener('click', this.hideDrawer);
      // document.addEventListener('touchstart', this.hideDrawer);
    }
  }
};

</script>

<style lang="scss">
@import '../style/global.scss';

div.side-bar {
  /* Mobile devices */
  @media screen and (max-width: 800px) {
    min-height: 40px;
  }
}

@media screen and (max-width: 800px) {
  div.drawer {
    z-index: 100;
    box-sizing: border-box;
    width: 80vw;
    height: calc(100vh - 40px); /* title bar */
    position: fixed;
    top: 40px;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch; // iOS
    max-width: 300px;
    transform: translateX(-100vw);
  }

  div.drawer, div.drawer-container {
    z-index: 50;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    transition: all ease 0.3s;
  }

  div.drawer-container {
    top: 0;
  }

  div.drawer::-webkit-scrollbar {
    display: none;
  }

  div.drawer-container {
    pointer-events: none;
  }

  div.drawer-container.active {
    background-color: rgba(0, 0, 0, 0.5);
    pointer-events: initial;
  }

  div.drawer.active {
    transform: initial;
  }
}

header.title {
  text-align: center;
  position: relative;
  padding-top: 1px;
  z-index: 200;

  > a {
    // Fix IE11
    border-bottom: none;
  }
  h1, h2 {
    font-weight: normal;
  }
  h1 {
    font-size: 2em;
    font-family: 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif;
    letter-spacing: 2px;
    font-weight: 300;
  }
  h2 {
    font-size: 20px;
  }

  svg g {
    fill: $card_title_background_color;
    fill-opacity: 0.8;
    stroke: none;
  }

  /* Mobile devices */
  @media screen and (max-width: 800px) {
    position: fixed;
    width: 100vw;
    background: rgba(white, 0.9);

    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);

    h1 {
      margin: 0;
      height: 40px;
      line-height: 40px;
      font-size: 24px;
    }

    h2 {
      display: none;
    }

    svg.drawer-trigger {
      height: 20px;
      width: 20px;
      position: absolute;
      top: 0;
      left: 0;
      padding: 12px 10px 8px 10px;
    }
  }

  @media screen and (min-width: 800px) {
    svg.drawer-trigger {
      display: none;
    }
  }
}
</style>