<template lang="pug">
  div.admin-side-bar
    site-title
    hr
    ul
      li: router-link(to="/admin/post/new") 创建文章
      li: router-link(to="/admin/post") 管理文章
      li: router-link(to="/admin/widgets") 管理小工具
      li 管理页面
      li 管理媒体
</template>

<script>
import SiteTitle from '../SiteTitle.vue';

export default {
  name: 'admin-side-bar',
  components: {
    SiteTitle
  }
};

</script>

<style lang="scss">
@import '../../style/global.scss';

.admin-side-bar {
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    height: 2em;
    line-height: 2em;
  }

  li {
    padding-left: 1em;

    a {
      display: block;
      text-decoration: none;
    }
  }

  li:hover {
    background-color: mix($theme_color, white, 80%);
  }
}

</style>