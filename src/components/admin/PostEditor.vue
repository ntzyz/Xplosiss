<template lang="pug">
  div.post-editor.card
    h3.title 创建/编辑文章
    div.container: table.form-table
      tr
        td.label 标题：
        td: input.full(v-model="title")
      tr
        td.label URL 名称：
        td: input.full(v-model="slug")
      tr
        td.label 分类：
        td
          select.full(v-if="category === '' || categories.indexOf(category) >= 0" v-model="category")
            option(v-for="c in categories", :value="c") {{ c }}
            option(vaule="") 自定义
          input(v-else v-model="category")
      tr
        td.label 标签：
        td: span(v-for="(tag, idx) in arraylize(tags)" @click="deleteTag(tag)") {{ '#' + tag }} 
      tr
        td.label 常用标签：
        td
          button.tag(v-for="tag in $store.state.tags" @click="addTag(tag.tag)") {{ tag.tag }}
          button.tag(@click="addTag(prompt('新标签叫啥呢？'))") +
      tr
        td.label 封面图片：
        td: input.full(v-model="cover") 
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
      cover: '',
      content: {
        encoding: 'html',
        content: '',
      }
    };
  },
  computed: {
    categories () {
      return this.$store.state.categories;
    }
  },
  methods: {
    prompt (string) {
      return window.prompt(string);
    },
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
          cover: this.cover,
        },
      }).then(() => {
        alert('文章已更新');
        this.fetchPost();
      }).catch(e => {
        alert('会话过期，请手动刷新');
      });
    },
    createPost() {
      if (!this.title || !this.slug) {
        alert('标题和 URL 名称是必须的！');
        return;
      }
      api.post.createPost({
        token: this.$store.state.token,
        post:{
          title: this.title,
          slug: this.slug,
          date: new Date(this.date.year, this.date.month - 1, this.date.day, this.date.hour, this.date.minute, this.date.second),
          category: this.category,
          content: this.content,
          tags: this.tags,
          cover: this.cover,
        },
      }).then(res => {
        alert('文章已创建。');
        this.$router.push(`/admin/post/edit/${res.id}`);
      }).catch(e => {
        alert('会话过期，请手动刷新');
      });
    },
    fetchPost () {
      api.post.fetchPostById({ id: this.$route.params.id }).then(post => {
        this.title = post.title;
        this.slug = post.slug;
        this.category = post.category;
        this.content = post.content;
        this.cover = post.cover;
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
        };
      });
    },
    fetchTags () {
      this.$store.dispatch('fetchTags');
    },
    fetchCategories () {
      this.$store.dispatch('fetchCategory');
    },
    deletePost () {
      if (!confirm('确认要删除文章？此操作不可撤销。')) {
        return;
      }
      api.post.deletePostById({ id: this.$route.params.id, token: this.$store.state.token }).then(() => {
        this.back();
      }).catch(e => {
        alert('会话过期，请手动刷新');
      });
    }
  },
  created () {
    if (this.$store.state.token === '') {
      this.$router.push('/admin');
    }
    this.$store.commit('setBusy', false);
    if (this.$route.params.id) {
      this.fetchPost();
    }
    this.fetchTags();
    this.fetchCategories();
    // document.querySelector('#app').style.maxWidth = 'initial';
  },
  watch: {
    // 'content.content': function () {
    //   this.$nextTick(() => {
    //     document.querySelector('textarea').style.height = document.querySelector('textarea').scrollHeight + 'px';
    //   });
    // },
    '$route': function () {
      Object.assign(this.$data, this.$options.data());
      this._tags = new Set();
      if (this.$route.params.id) {
        this.fetchPost();
      }
    }
  },
  beforeDestroy () {
    // document.querySelector('#app').style.maxWidth = '';
  }
};

</script>

<style lang="scss" scoped>
@import '../../style/form-table.scss';

div.post-editor {
  .container {
    padding: 1em;
  }
  input.short {
    width: 2.5em;
  }
  button.tag {
    margin-right: 4px;
    margin-bottom: 4px;
  }
  button {
    font-size: 12px;
    margin-right: 2px;
  }
}
</style>