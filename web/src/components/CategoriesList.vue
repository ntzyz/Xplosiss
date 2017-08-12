<template lang="pug">
  div.category-list
    h3 Category
    ul
      li(v-for="category in categories"): router-link(:to="'/category/' + category") {{ category }}
</template>

<script>
export default {
  name: 'categories-list',
  computed: {
    categories () { return this.$store.state.categories; }
  },
  asyncData ({store, state}) {
    return store.dispatch('fetchCategory');
  }
}
</script>

<style lang="scss">
div.category-list {
  ul {
    list-style: none;
    padding: 0;
  }

  li {
    display: block;
    font-size: 1em;
    height: 2em;
    line-height: 2em;
    padding-left: 1em;
    transition: background ease 0.5s;

    a {
      display: block;
    }

    a:hover {
      text-decoration: none;
    }
  }

  li:hover {
    cursor: pointer;
    background: rgba(255, 255, 255, 0.2);
    transition: background ease 0.1s;
    text-decoration: none;
  }
}
</style>
