<template lang="pug">
  div.gallery 
    div.title-card.card {{ title }}
    div.empty(v-if="!images || images.length === 0") 目前，这里除了好奇什么都没有。
    div.gallery-item.card(v-for="image in images")
      div.image(v-bind:style="{ backgroundImage: `url(${image.cover})` }")
      div.introduction
        header.title
          a(v-if="image.href" :href="image.href" target="_blank"): h3 {{ image.title }}
          h3(v-else) {{ image.title }}
        article.description {{ image.description }}
        footer.meta
          span {{ timeToString(new Date(image.date), true) }}
          span(v-for="tag in image.tags") \#{{ tag }}
</template>

<script>
import timeToString from '../../../src/utils/timeToString';

export default {
  name: 'Gallery',
  data () {
    return {
      activeImage: null,
    };
  },
  computed: {
    images () {
      return this.$store.state.gallery.images;
    },
    title () {
      return this.$store.state.gallery.title;
    }
  },
  asyncData ({ store, route }) {
    return store.dispatch('fetchImages');
  },
  mounted () {
    this.$store.commit('setBusy', false);
  },
  methods: {
    timeToString,
    imageOnClick (image, event) {
      if (window.innerWidth <= 800 && this.activeImage !== image) {
        this.activeImage = image;
        event.preventDefault();
        event.stopPropagation();
      } else if (image.href) {
        window.open(image.href);
      }
    },
    tagOnClick (tag) {
      window.open(`/tag/${tag}`);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../../src/style/global.scss';


.gallery {
  $height: 220px;

  div.content {
    display: flex;
    flex-wrap: wrap;
    padding: 0.5em;
  }

  div.item-wrapper {
    width: calc(33.3% - 1em);
    margin: 0.5em;
    box-sizing: border-box;
    position: relative;
  }

  div.item-border {
    overflow: hidden;
    padding-top: 75%;
    position: relative;
  }

  div.empty {
    text-align: center;
    width: 100%;
    font-size: 2.5em;
    line-height: 200px;
    color: grey;
    user-select: none;
    font-weight: 500;
  }

  div.gallery-item {
    padding-bottom: 0;
    display: flex;

    div.image {
      width: 320px;
      padding-top: 240px;
      background-size: cover;
      background-position: center;
      margin: 15px 0 15px 15px;
      flex-grow: 0;
      flex-shrink: 0;
    }

    div.introduction {
      flex-grow: 1;
      flex-shrink: 1;
      overflow: hidden;
      padding: 1em;
      display: flex;
      min-width: 0;
      flex-direction: column;
    }

    header.title {
      z-index: initial;
      position: initial;
      background: initial;
    }

    header.title h3 {
      color: $card_title_background_color;
      margin: 0;
      text-align: left;
      font-weight: 600;
    }

    a:hover {
      text-decoration: underline;
    }

    article.description {
      flex-grow: 1;
      flex-shrink: 1;
      min-height: 0;
      padding: 1em 0;
    }

    footer.meta {
      text-align: left;
      padding: 0;

      span {
        margin-right: 1em;
      }
    }
  }

  @media screen and (max-width: 800px) {
    div.gallery-item.card {
      position: relative;
      min-height: 220px;
      &:not(:last-child) {
        margin-bottom: 5px;
      }
      div.image {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: 0;
        padding: 0;
        width: initial;
        z-index: 0;
      }
      div.introduction {
        background: rgba(0, 0, 0, 0.3);
        z-index: 1;
        position: relative;
      }
      header {
        backdrop-filter: none;
      }
      header.title h3, div.introduction, footer.meta {
        color: white;
        $shadow-color: #333;
        text-shadow: $shadow-color 1px 0px 1px, $shadow-color 0px 1px 1px, $shadow-color 0px -1px 1px, $shadow-color -1px 0px 1px;
      }
    }
  }
}
</style>
