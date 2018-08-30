<template lang="pug">
  nav.pagination
    ul(v-if="pages")
      li
        router-link(:to="prefix + '/page/1'").button &laquo;
      li(v-for="page in pages")
        template(v-if="page !== null")
          router-link(:to="prefix + '/page/' + page" v-if="Number(current) !== page").button {{ page }}
          a.disabled.button(v-else) {{ page }}
        template(v-else)
          span …
      li
        router-link(:to="prefix + '/page/' + max").button &raquo;
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    current: {
      type: Number,
      required: true,
    },
    length: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    prefix: {
      type: String,
      required: true,
    },
  },
  data () {
    return {
      pages: [],
    };
  },
  watch: {
    max () {
      this.init();
    },
    current () {
      this.init();
    }
  },
  created () {
    this.init();
  },
  methods: {
    init () {
      let current = parseInt(this.current);
      let left = Math.max(1, current - Math.floor(Number(this.length) / 2));
      let pages = new Array(parseInt(this.length)).fill(0).map((dummy, index) => index + left).filter(i => i <= Number(this.max));

      if (pages.length < Number(this.length)) {
        const padCount = Number(this.length) - pages.length;
        pages = [
          ...new Array(padCount).fill(0).map((dummy, index) => pages[0] - padCount + index).filter(el => el > 0),
          ...pages
        ];
      }

      if (pages[0] && pages[0] > 1) {
        pages.shift();
        pages.shift();
        pages.unshift(null);
        pages.unshift(1);
      }

      if (pages[pages.length - 1] < Number(this.max)) {
        pages.pop();
        pages.pop();
        pages.push(null);
        pages.push(Number(this.max));
      }

      this.pages = pages;
    }
  },
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
    min-width: $size;
    min-height: $size;
    font-size: 14px;
    line-height: $size;
    text-align: center;
    margin-left: 0.3em;
    cursor: pointer;
    a:not(.disabled) {
      background-color: rgb(245, 245, 245);
      color: black;
      box-shadow: none;
    }
    a {
      display: inline-block;
      padding: 0 0.75em 0 0.75em;
    }
    a.disabled {
      cursor: initial;
    }
    a:hover {
      border: none;
    }
  }
}
</style>
