<template lang="pug">
  div.card.gallery 
    h3.title Gallery
    div.content
      div.item-wrapper(v-for="image in images")
        div.item(v-bind:style="{ backgroundImage: `url(${image.cover})` }")
        div.introduction
          h1.image-title {{ image.title }}
          p {{ image.description }}
</template>

<script>
export default {
  name: 'gallery',
  mounted () {
    this.$store.commit('setBusy', false);
  },
  computed: {
    images () {
      return this.$store.state.gallery.images;
    }
  },
  asyncData ({ store, route }) {
    return store.dispatch('fetchImages');
  }
};
</script>

<style lang="scss" scoped>
.gallery {
  div.content {
    display: flex;
     flex-wrap: wrap;
  }

  div.item-wrapper {
    width: 50%;
    height: 300px;
    overflow: hidden;
    position: relative;
  }

  div.item {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    transition: all ease 0.6s;

    &:hover {
      transform: scale(1.05);
      transition: all ease 0.3s;
      filter: blur(2px);
    }
  }

  div.item:hover + div.introduction {
    opacity: 1;
  }

  div.introduction {
    position: absolute;
    top: 0; bottom: 0;
    left: 0; right: 0;
    padding: 0 1em;
    text-align: center;
    color: white;
    text-shadow: rgba(white, 0.3) 0 0 2px;
    background: rgba(0, 0, 0, 0.6);
    opacity: 0;
    transition: all ease 0.3s;
    pointer-events: none;
  }

  h1.image-title {
    margin: 3em 0 0 0;
  }

  @media screen and (max-width: 800px) {
    // mobile overrides
    div.item-wrapper {
      width: 100%;
    }

    div.item:hover {
      filter: none;
      transform: none;
    }

    div.introduction {
      opacity: 1;
      background: rgba(0, 0, 0, 0.6);
    }
  }

}
</style>
