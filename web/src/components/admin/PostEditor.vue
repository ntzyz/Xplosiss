<template lang="pug">
  div.post-editor
    h2 创建/编辑文章
    table
      tr
        td.label 标题：
        td: input.full(v-model="title")
      tr
        td.label URL 名称：
        td: input.full(v-model="slug")
      tr
        td.label 分类：
        td: input.full(v-model="category")
      tr
        td.label 标签：
        td: span(v-for="(tag, idx) in arraylize(tags)" @click="deleteTag(tag)") {{ '#' + tag }} 
      tr
        td.label 常用标签：
        td: button.tag(v-for="tag in $store.state.tags" @click="addTag(tag.tag)") {{ tag.tag }}
      tr
        td.label 日期：
        td
          input.year(v-model="date.year")
          | 年
          input.short(v-model="date.month")
          | 月
          input.short(v-model="date.day")
          | 日　
          input.short(v-model="date.hour")
          | 时
          input.short(v-model="date.minute")
          | 分
          input.short(v-model="date.second")
          | 秒
      tr
        td.label 文章语法：
        td: select(v-model="content.encoding")
          option(value="jade") Jade/Pug
          option(value="markdown") Markdown
          option(value="HTML") HTML
      tr
        td.label 文章内容：
        td: textarea.content(v-model="content.content")
      tr
        td
        td
          button(@click="back") 返回
          button(v-if="id" @click="updatePost") 更新文章
          button(v-else @click="createPost") 发布文章
          button(v-if="id !== ''" style="float: right; margin-right: 28px;" @click="deletePost") 删除文章
</template>

<script>
import api from '../../api';

export default {
  name: 'post-editor',
  data () {
    let date = new Date();
    return {
      id: '',
      title: '',
      slug: '',
      tags: [],
      _tags: new Set(),
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds()
      },
      category: '',
      tag: '',
      content: {
        encoding: 'html',
        content: '',
      }
    }
  },
  methods: {
    back () {
      window.history.go(-1);
    },
    arraylize (set) {
      return [...set];
    },
    addTag (tag) {
      if (!this._tags) this._tags = new Set();
      this._tags.add(tag);
      this.tags = [...this._tags];
    },
    deleteTag (tag) {
      this._tags.delete(tag);
      this.tags = [...this._tags];
    },
    updatePost () {
      api.post.updatePostById({
        token: this.$store.state.token,
        id: this.id,
        post:{
          title: this.title,
          slug: this.slug,
          date: new Date(this.date.year, this.date.month - 1, this.date.day, this.date.hour, this.date.minute, this.date.second),
          category: this.category,
          content: this.content,
          tags: this.tags,
        },
      }).then(() => {
        alert('文章已更新');
        this.fetchPost();
      }).catch(e => {
        alert('会话过期，请手动刷新');
      })
    },
    createPost() {
      api.post.createPost({
        token: this.$store.state.token,
        post:{
          title: this.title,
          slug: this.slug,
          date: new Date(this.date.year, this.date.month - 1, this.date.day, this.date.hour, this.date.minute, this.date.second),
          category: this.category,
          content: this.content,
          tags: this.tags,
        },
      }).then(res => {
        alert('文章已创建。');
        this.$router.push(`/admin/post/edit/${res.id}`);
      }).catch(e => {
        alert('会话过期，请手动刷新');
      })
    },
    fetchPost () {
      api.post.fetchPostById({ id: this.$route.params.id }).then(post => {
        this.title = post.title;
        this.slug = post.slug;
        this.category = post.category;
        this.content = post.content;
        this.id = post._id;
        this._tags = new Set(post.tags);
        this.tags = [...this._tags];
        let tmpDate = new Date(post.date);
        this.date = {
          year: tmpDate.getFullYear(),
          month: tmpDate.getMonth() + 1,
          day: tmpDate.getDate(),
          hour: tmpDate.getHours(),
          minute: tmpDate.getMinutes(),
          second: tmpDate.getSeconds(),
        }
      });
    },
    fetchTags () {
      this.$store.dispatch('fetchTags');
    },
    deletePost () {
      if (!confirm('确认要删除文章？此操作不可撤销。')) {
        return;
      }
      api.post.deletePostById({ id: this.$route.params.id, token: this.$store.state.token }).then(() => {
        this.back();
      }).catch(e => {
        alert('会话过期，请手动刷新')
      })
    }
  },
  created () {
    if (this.$store.state.token === '') {
      this.$router.push('/admin');
    }
    if (this.$route.params.id) {
      this.fetchPost();
    }
    this.fetchTags();
    document.querySelector('#app').style.maxWidth = 'initial';
  },
  watch: {
    'content.content': function () {
      this.$nextTick(() => {
        document.querySelector('textarea').style.height = document.querySelector('textarea').scrollHeight + 'px';
      });
    },
    '$route': function () {
      Object.assign(this.$data, this.$options.data());
      this._tags = new Set();
      if (this.$route.params.id) {
        this.fetchPost();
      }
    }
  },
  beforeDestroy () {
    document.querySelector('#app').style.maxWidth = '';
  }
}

</script>

<style lang="scss" scoped>
div.post-editor {
  table {
    width: 100%;
    border-spacing: 10px;
  }
  td.label {
    width: 90px;
    text-align: right;
    vertical-align: top;
  }
  input.full {
    width: 95%;
  }
  textarea.content {
    width: 95%;
    min-height: 20rem;
    max-height: 90vh;
    line-height: 1rem;
    font-size: 0.8rem;
    resize: none;
  }
  input.short {
    width: 2.5em;
  }
  button.tag {
    margin-right: 4px;
    margin-bottom: 4px;
  }
}
</style>