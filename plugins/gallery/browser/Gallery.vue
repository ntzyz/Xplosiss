<template lang="pug">
  div.card.gallery 
    h3.title {{ title }}
    div.content(@click="activeImage = null")
      div.empty(v-if="images.length === 0") 目前，这里除了好奇什么都没有。
      div.item-wrapper(v-for="image in images" v-bind:style="{ cursor: image.href ? 'pointer' : '' }" @click="imageOnClick(image, $event)")
        div.item-border
          div.introduction
            p.description {{ image.description }}
            div.tags(v-if="image.tags && image.tags.length !== 0")
              span.tag(v-for="tag in image.tags" @click="tagOnClick(tag)") {{ tag }}
          div.item(v-bind:style="{ backgroundImage: `url(${image.cover})` }")
        h3.image-title {{ image.title }}
</template>

<script>
export default {
  name: 'gallery',
  data () {
    return {
      activeImage: null,
    };
  },
  mounted () {
    this.$store.commit('setBusy', false);
  },
  computed: {
    images () {
      return this.$store.state.gallery.images;
    },
    title () {
      return this.$store.state.gallery.title;
    }
  },
  methods: {
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
  },
  asyncData ({ store, route }) {
    return store.dispatch('fetchImages');
  }
};
</script>

<style lang="scss" scoped>
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

  div.item {
    width: 100%;
    height: $height;
    background-size: cover;
    background-position: center;
    transition: all ease 0.6s;
  }

  div.introduction:hover + div.item {
    transform: scale(1.1);
    transition: all ease 0.3s;
    user-select: none;
    // filter: blur(2px);
  }

  div.introduction:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.5);
  }

  div.introduction {
    position: absolute;
    top: 0;
    left: 0; right: 0;
    z-index: 3;
    height: $height;
    padding: 0 1em;
    color: white;
    $shadow-color: #333;
    text-shadow: $shadow-color 1px 0px 1px, $shadow-color 0px 1px 1px, $shadow-color 0px -1px 1px, $shadow-color -1px 0px 1px;
    transition: all ease 0.3s;
    opacity: 0;
  }

  h3.image-title {
    margin: 0.5em 0 0 0;
    font-size: 1.2rem;
    font-weight: normal;
    font-family: 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif;
    text-align: center;
  }

  p.description {
    font-size: 0.95rem;
  }

  div.tags {
    position: absolute;
    bottom: 0.5em;
    font-size: 13px;
    display: flex;
    flex-wrap: wrap;
  }

  div.tags::before {
    // content: 'Tags:';
  }

  span.tag {
    display: block;
    padding: 0px 4px;
    cursor: pointer;
  }

  span.tag::before {
    content: '#'
  }

  @media screen and (max-width: 1152px) {
    // middle device override
    div.item-wrapper {
      width: calc(50% - 1em);
    }
  }

  @media screen and (max-width: 920px) {
    // middle device override
    div.item-wrapper {
      width: calc(100% - 1em);
    }
  }

  @media screen and (max-width: 800px) {
    // tablet overrides
    div.item-wrapper {
      width: calc(50% - 1em);
    }
  }

  @media screen and (max-width: 512px) {
    // mobile overrides
    div.item-wrapper {
      width: calc(100% - 1em);
    }
  }

  @media screen and (max-width: 800px) {
    // mobile overrides

    // div.introduction:hover + div.item {
    //   filter: none;
    //   transform: none;
    // }

    // div.introduction {
    //   opacity: 1;
    //   background: rgba(0, 0, 0, 0.5);
    // }
  }

}
</style>
