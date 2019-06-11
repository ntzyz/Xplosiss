<template lang="pug">
  div.reply#reply: div.card
    h3.title 评论
    div.content
      ul.replies-list(v-if="replies && replies.length !== 0")
        li(v-for="reply in replyTree", v-bind:style="{ marginLeft: reply.depth * 56 + 'px' }", v-if="!reply.deleted")
          div.avatar
            div.github-avatar(v-if="reply.githubId", v-bind:style="{ backgroundImage: `url(https://github.com/${reply.githubId}.png)` }")
            div.fallback-avatar {{ reply.user.trim().substr(0, 1).toUpperCase() }}
          div.reply-body
            div.name {{ reply.user }} {{ reply.site !== '' ? `from ${reply.site}` : ''}}
            div.date {{ timeToString(reply.datetime) }}
            div(v-html="reply.content" v-if="reply.markdown")
            div.raw-content(v-else) {{ reply.content }}
            a.reply-to(@click="setReplyTo(reply.index)") 回复该评论
      div#reply-form.send-new
        h3(v-if="replyTo === null") 发表评论
        h3(v-if="replyTo !== null && replies[replyTo] !== undefined") 回复给 {{ replies[replyTo].user }}
        table.form-table: tbody
          tr
            th 姓名
            td: input.full(v-model="name", placeholder="必填")
          tr
            th GitHub ID
            td: input.full(v-model="githubId", placeholder="选填，填写后可以显示头像")
          tr
            th 站点
            td: input.full(v-model="site", placeholder="选填")
          tr
            th 电子邮件
            td: input.full(v-model="email", placeholder="选填，邮件地址不会公开")
          tr
            th 评论
            td: textarea.content(v-model="content", placeholder="必填，可以使用 Markdown 语法")
          tr
            td
            td
              button(@click="submit") 提交
              button(@click="reset") 重置
</template>

<script>
import timeToString from '../utils/timeToString';
import api from '../api';

function ReplyNode (value) {
  this.value = value;
  this.childs = [];
}

export default {
  name: 'Reply',
  props: {
    replies: {
      type: Array,
      required: true,
    },
    'apiPath': {
      type: String,
      required: true,
    },
    'refreshReplies': {
      type: Function,
      required: true,
    }
  },
  data () {
    return {
      name: '',
      email: '',
      content: '',
      site: '',
      githubId: '',
      replyTo: null,
      busy: false,
    };
  },
  computed: {
    replyTree () {
      let replies = this.replies.map((el, idx) => {
        el.index = idx;
        return el;
      });

      if (!replies) {
        return;
      }

      let nodes = [];
      let root = [];
      replies.forEach((reply, index) => {
        let node = new ReplyNode(reply);
        nodes[index] = node;

        if (typeof reply.replyTo === 'number') {
          nodes[reply.replyTo].childs.push(node);
        } else {
          root.push(node);
        }
      });

      let treeView = [];
      let dfs = (node, depth = 0) => {
        const value = node.value;
        value.depth = depth;
        treeView.push(value);

        node.childs.forEach(childNode => dfs(childNode, depth + 1));
      };

      root.forEach(node => dfs(node, 0));

      return treeView;
    }
  },
  watch: {
    replies () {
      this.reset();
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.$route.hash === '#reply') {
        this.$el.scrollIntoView();
      }
    });
  },
  methods: {
    timeToString,
    submit () {
      if (this.busy) {
        return;
      }

      this.busy = true;

      let data = {
        user: this.name,
        email: this.email,
        site: this.site,
        content: this.content,
        replyTo: this.replyTo,
        githubId: this.githubId,
      };

      if (!data.user) {
        alert('姓名是必填项呢');
        return;
      } else if (!data.content) {
        alert('评论内容为空呢');
        return;
      }

      api[this.$props.apiPath].putReplyBySlug({ slug: this.$route.params.slug, data })
        .then(() => {
          if (this.$store.state.forceReload) {
            window.location.href = window.location.href;
          } else {
            this.$props.refreshReplies();
          }

          this.busy = false;
        });
    },
    reset () {
      Object.assign(this.$data, {
        name: '',
        email: '',
        content: '',
        site: '',
        githubId: '',
        replyTo: null,
      });
    },
    setReplyTo (idx) {
      this.replyTo = idx;
      this.focusReplyForm();
    },
    focusReplyForm () {
      this.$el.querySelector('#reply-form').scrollIntoView();
    },
  },
};
</script>

<style lang="scss">
@import '../style/global.scss';
@import '../style/form-table.scss';

div.reply {
  div.content {
    padding: 0 1em 0 1em;
  }
  table th {
    text-align: right;
    width: 90px;
    vertical-align: top;
    font-weight: normal;
  }
  table {
    width: 90%;
    border-spacing: 5px;
  }
  table textarea.content {
    height: 8em;
  }

  div.raw-content {
    white-space: pre;
  }

  ul.replies-list {
    padding: 0;
    list-style: none;

    > li {
      position: relative;
      display: flex;
      padding: 0.6em 1em 0.1em 0.3em;
      margin: 0.5em 0 0.5em 0;
      // background-color: rgb(245, 245, 245);
      border-radius: 2px;
      line-height: 1.2em;

      pre {
        background-color: inherit;
        border: rgb(235, 235, 235);
        border-radius: 0;
      }

      a.reply-to {
        font-size: 12px;
        position: absolute;
        bottom: 5px;
        right: 8px;
        opacity: 0;
        transition: all ease 0.3s;
        &:not(:hover) {
          border-bottom: 1px solid transparent;
        }
      }

      div.avatar, div.github-avatar {
        width: 40px;
        height: 40px;
      }

      div.avatar {
        flex-grow: 0;
        flex-shrink: 0;
        border-radius: 20px;
        overflow: hidden;
        margin-top: 5px;
        margin-right: 1em;
        position: relative;
      }

      div.github-avatar, div.fallback-avatar {
        position: absolute;
      }

      div.github-avatar {
        z-index: 2;
        background-size: cover;
      }

      div.fallback-avatar {
        z-index: 1;
        user-select: none;
        line-height: 40px;
        width: 40px;
        text-align: center;
        font-size: 20px;
        background-color: $avatar_fallback_background_color;
        color: $avatar_fallback_text_color;
        user-select: none;
      }
    }

    > li:hover {
      a.reply-to {
        opacity: 1;
        transition: none;
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

  button {
    font-size: 12px;
    margin-right: 5px;
  }
}
</style>