<template lang="pug">
  nav.pagination
    ul(v-if="pages")
      li
        router-link(:to="prefix + '/page/' + (current - 1)" v-if="Number(current) !== 1"): button &laquo;
        button(v-else) &laquo;
      li(v-for="page in pages")
        router-link(:to="prefix + '/page/' + page" v-if="Number(current) !== page"): button {{ page }}
        button.disabled(v-else) {{ page }}
      li
        router-link(:to="prefix + '/page/' + (current + 1)" v-if="Number(current) !== Number(max)"): button &raquo;
        button(v-else) &raquo;
</template>

<script>
export default {
  name: 'pagination',
  props: ['current', 'length', 'prefix', 'max'],
  data () {
    return {
      pages: [],
    };
  },
  methods: {
    init () {
      let current = parseInt(this.current);
      let left = Math.max(1, current - Math.floor(Number(this.length) / 2));
      this.pages = new Array(parseInt(this.length)).fill(0).map((dummy, index) => index + left).filter(i => i <= Number(this.max));
    }
  },
  created () {
    this.init()
  },
  watch: {
    max () {
      this.init();
    },
    active () {
      this.init();
    }
  }
};
</script>

<style lang="scss">
@import '../style/global.scss';
nav.pagination {
  $size: 28px;
  position: relative;
  margin: 0;
  padding: 20px;
  height: $size;
  ul {
    display: inline-block;
    list-style: none;
    padding: 0;
    margin-left: 85px;
    position: absolute;
    right: 10px;
    margin: 0;
  }
  li {
    display: inline-block;
    width: $size;
    height: $size;
    font-size: 14px;
    line-height: $size;
    text-align: center;
    margin-left: 1em;
    cursor: pointer;
    button:not(.disabled) {
      background-color: rgb(245, 245, 245);
      color: black;
      box-shadow: none;
    }
    button, a {
      display: inline-block;
      width: inherit;
      height: inherit;
      line-height: inherit;
      padding: 0;
    }
    button.disabled {
      cursor: initial;
    }
  }
  li:first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  li:last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
}
</style>
