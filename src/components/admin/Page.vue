<template lang="pug">
  div.pages-manage
    h3 管理自定义页面
    div(v-if="editing === null")
      ul.pages-list
        li(v-for="page in pages" @click="edit(page._id)") {{ page.title }}
        li(@click="edit(undefined)") 创建新的自定义页面 
    div(v-else)
      table.form-table
        tr
          td.label 标题
          td: input.full(v-model="page.title")
        tr
          td.label URL 名称
          td: input.full(v-model="page.slug")
        tr
          td.label 文章语法
          td: select(v-model="page.content.encoding")
            option(value="jade") Jade/Pug
            option(value="markdown") Markdown
            option(value="HTML") HTML
        tr
          td.label 内容
          td: textarea.content(v-model="page.content.content")
        tr
          td.label
          td.full
            button(@click="back") BACK
            button(@click="updatePage") SUBMIT
            button.red.right(v-if="typeof this.editing !== 'undefined'" @click="deletePage") DELETE
</template>

<script>
import api from '../../api';

export default {
  name: 'page',
  data () {
    return {
      pages: [],
      editing: null,
      page: {},
    };
  },
  created () {
    this.fetchPages();
  },
  methods: {
    fetchPages () {
      api.page.fetchPages().then(pages => {
        this.pages = pages;
      });
    },
    edit (id) {
      this.page = {};
      this.editing = id;
      if (id) {
        // Load page data from server.
        api.page.fetchPageById({ id, raw: true }).then(page => {
          this.page = page;
        });
      } else {
        // Create an empty template
        this.page = {
          title: '',
          slug: '',
          content: {
            encoding: '',
            content: '',
          }
        };
      }
    },
    back () {
      // Clean up
      this.page = {};
      this.editing = null;
      // refresh data
      this.fetchPages();
    },
    updatePage () {
      if (this.editing) {
        api.page.updatePageById({ id: this.editing, token: this.$store.state.token, page: this.page }).then(() => {
          alert('更新成功');
        });
      } else {
        api.page.createPage({ token: this.$store.state.token, page: this.page }).then(data => {
          console.log(data);
          this.editing = data.id;
          alert('创建成功');
        });
      }
    },
    deletePage () {
      if (confirm('确认要删除该页面吗？此操作不可撤销。')) {
        api.page.deletePageById({ id: this.editing, token: this.$store.state.token }).then(() => {
          alert('删除成功');
          this.back();
        });
      }
    }
  }
};
</script>

<style lang="scss">
@import '../../style/form-table.scss';

div.pages-manage {
  ul.pages-list {
    li {
      cursor: pointer;
    }
  }

  button {
    font-size: 14px;
    margin-right: 5px;
  }

  button.red {
    background: #cc0000;
  }

  .right {
    float: right;
  }
}
</style>