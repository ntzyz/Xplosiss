<template lang="pug">
  div.posts-list.card
    h3.title 文章列表
    div.container: table
      thead: tr
        th 标题
        th 时间
        th 分类
        th.tag 标签
      tbody: tr(v-for="post in posts")
        td.title: span: router-link(:to="'/admin/post/edit/' + post._id") {{ post.title }}
        td.center.date: span {{ timeToString(post.date, true) }}
        td.center.category: span {{ post.category }}
        td.tag: span {{ post.tags ? post.tags.join(', '): '' }}
    pagination(v-if="pages && pages.current", :current="pages.current", :length="7", :max="pages.max", prefix="/admin/post")
</template>

<script>
import api from '../../api';
import timeToString from '../../utils/timeToString';
import Pagination from '../Pagination.vue';

export default {
  name: 'PostsList',
  components: { Pagination },
  data () {
    return {
      posts: [],
      pages: {}
    };
  },
  watch: {
    '$route': function () {
      this.loadPosts(this.$route.params.page || 1);
    }
  },
  created () {
    if (this.$store.state.token === '') {
      this.$router.push('/admin');
    } else {
      this.$store.commit('setBusy', false);
      this.loadPosts(this.$route.params.page || 1);
    }
  },
  methods: {
    timeToString,
    loadPosts (page) {
      this.posts = [];
      api.post.fetchPosts({ page, full: true, titleOnly: true, pagesize: 20 }).then(data => {
        this.posts = data.posts;
        this.pages = data.page;
      });
    }
  }
};
</script>

<style lang="scss">
@import '../../style/global.scss';

.posts-list {
  .container {
    padding: 1em;
  }
  table {
    width: 100%;
  }
  td.center {
    text-align: center;
  }
  td {
    position: relative;
    padding: 0.5em;
  }
  td > span {
    position: absolute;
    left: 0;
    right: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  td.title {
    width: 30%;
  }
  td.date {
    width: 20%;
  }
  td.category {
    width: 10%;
  }
  td.tag {
    width: 20%;
    font-size: 0.85rem;
    line-height: 1rem;
    height: 2rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}

</style>