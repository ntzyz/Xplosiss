<template lang="pug">
  div.reply
    div(v-if="replies && replies.length !== 0")
      h3 评论列表
      ul.replies-list
        li(v-for="reply in replies")
          div.name {{ reply.user }} from {{ reply.site }}
          div.date {{ timeToString(reply.datetime) }}
          div(v-html="reply.content" v-if="reply.markdown")
          div.raw-content(v-else) {{ reply.content }}
    div.send-new
      h3 发表评论
      table
        tr
          th 姓名
          td: input(v-model="name")
        tr
          th 站点
          td: input(v-model="site")
        tr
          th 电子邮件
          td: input(v-model="email", placeholder="邮件地址不会公开")
        tr
          th 评论
          td: textarea(v-model="content", placeholder="We support markdown!")
        tr
          td
          td: button(@click="submit") 提交

</template>

<script>
import timeToString from '../utils/timeToString';
import api from '../api';

export default {
  name: 'reply',
  props: ['replies'],
  data () {
    return {
      name: '',
      email: '',
      content: '',
      site: 'https://',
    };
  },
  methods: {
    timeToString,
    submit () {
      let data = {
        user: this.name,
        email: this.email,
        site: this.site,
        content: this.content,
      }
      api.reply.putReplyBySlug({ slug: this.$route.params.slug, data })
      .then(() => {
        this.$store.dispatch('fetchPostBySlug', this.$route.params.slug);
      });
    }
  },
  watch: {
    replies () {
      this.name = this.email = this.content = '';
      this.site = 'https://';
    }
  }
}
</script>

<style lang="scss">
@import '../style/global.scss';

div.reply {
  table {
    width: 100%;
  }
  table th {
    text-align: right;
    width: 90px;
    vertical-align: top;
    font-weight: normal;
  }
  table {
    border-spacing: 5px;
  }
  table input, table textarea{
    width: 90%;
    resize: none;
  }
  table textarea {
    height: 8em;
  }

  div.raw-content {
    white-space: pre;
  }

  ul.replies-list {
    padding: 0;
    list-style: none;

    > li {
      padding: 1em;
      margin: 0.5em 0 0.5em 0;
      background-color: mix($theme_color, black, 90%);
      border-radius: 0.5em;
      line-height: 1.2em;

      pre {
        background-color: inherit;
        border: 1px solid mix($theme_color, white, 80%);
        border-radius: 0;
      }
    }

    div.name {
      font-weight: bold;
    }
    div.date, div.name {
      font-size: 0.8em;
      color: grey;
    }
  }
}
</style>