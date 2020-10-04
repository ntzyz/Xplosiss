<template lang="pug">
  div.post-editor.card
    h3.title 创建/编辑文章
    div.container: table.form-table: tbody
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
        td.label 首页隐藏：
        td: input(type="checkbox" v-model="hideOnIndex")
      tr
        td.label 过时警告：
        td: input(type="checkbox" v-model="outdatedWarning")
      tr
        td.label NSFW：
        td: input(type="checkbox" v-model="notSafeForWork")
      tr
        td.label 插入封面：
        td: input(type="checkbox" v-model="insertCover")
      tr
        td.label 密码保护：
        td: input.full(type="text" v-model="password" placeholder="留空即为公开访问")
      tr
        td.label 自然语言：
        td: select(v-model="editingLanguage")
          option(v-for="item of body" :key="item.language" :value="item.language") {{ item.language }}
          option(:value="null") 新增语言
      template(v-if="editingLanguage")
        tr
          td.label 标题：
          td
            input.full(v-model="currentEditingBody.title")
        tr
          td.label 文章语法：
          td
            select(v-model="currentEditingBody.format")
              option(value="markdown") Markdown
              option(value="jade") Jade/Pug
              option(value="HTML") HTML
        tr
          td.label 默认语言：
          td
            input(type="checkbox" v-model="currentEditingBody.default")
        tr
          td.label 文章内容：
          td: div.monaco-inject(ref="monaco" @paste="onPasteFile($event)" @drop="onDropFile($event)" @dragover="$event.preventDefault()")
            //- monaco-editor
            //- textarea.content(v-model="item.content"  @drop="onDropFile($event)" ref="textarea")
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
import preventLeaveMixin from '../../mixins/prevent-leave';

export default {
  name: 'PostEditor',
  mixins: [preventLeaveMixin],
  data () {
    let date = new Date();
    return {
      id: '',
      slug: '',
      tags: [],
      tagsSet: new Set(),
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds()
      },
      password: '',
      hideOnIndex: false,
      insertCover: true,
      outdatedWarning: false,
      notSafeForWork: false,
      category: '',
      tag: '',
      cover: '',
      body: [],
      editingLanguage: '',
      uploadId: 0,
      currentEditingBody: {},
      monaco: null,
    };
  },
  computed: {
    categories () {
      return this.$store.state.categories;
    }
  },
  watch: {
    editingLanguage (val) {
      if (val) {
        if (this.monaco) {
          this.currentEditingBody.content = this.monaco.getValue();
        }

        this.currentEditingBody = this.body.filter(el => el.language === val)[0];

        if (this.monaco) {
          this.monaco.setValue(this.currentEditingBody.content);
        }
        return;
      }
      const result = window.prompt('叫啥呢？');
      if (result && result.length > 0) {
        this.body.push({
          content: '',
          format: '',
          language: result,
          default: false,
        });
        this.editingLanguage = result;
      }
    },
    'currentEditingBody.format': function (val) {
      const formatLUT = {
        'jade': 'pug',
        'HTML': 'html',
        'markdown': 'markdown'
      };
      if (this.monaco) {
        window.monaco.editor.setModelLanguage(this.monaco.getModel(), formatLUT[val]);
      }
    },
    '$route': function () {
      const initialData = this.$options.data();
      for (const key of Object.keys(initialData)) {
        if (key === 'editingLanguage') {
          continue;
        }
        this[key] = initialData[key];
      }

      this.tagsSet = new Set();
      if (this.$route.params.id) {
        this.fetchPost(true);
      }
    }
  },
  mounted () {
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

    import('monaco-editor').then(monaco => {
      if (window.monacoEditor) {
        window.monacoEditor.dispose();
      }

      this.monaco = monaco.editor.create(this.$refs.monaco, {
        fontSize: '12px',
        language: this.currentEditingBody.format,
        folding: true,
        foldingStrategy: 'indentation',
        wordWrap: 'on',
        automaticLayout: true,
        overviewRulerBorder: true,
        scrollBeyondLastLine: true,
        minimap: {
          enabled: false
        },
        value: this.currentEditingBody.content
      });

      window.monacoEditor = this.monaco; 
    });
  },
  beforeDestroy () {
    // document.querySelector('#app').style.maxWidth = '';
    if (this.monaco) {
      this.monaco.displse();
      window.monacoEditor = null;
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
      if (!this.tagsSet) this.tagsSet = new Set();
      this.tagsSet.add(tag);
      this.tags = [...this.tagsSet];
    },
    deleteTag (tag) {
      this.tagsSet.delete(tag);
      this.tags = [...this.tagsSet];
    },
    updatePost () {
      if (this.monaco) {
        this.currentEditingBody.content = this.monaco.getValue();
      }

      api.post.updatePostById({
        token: this.$store.state.token,
        id: this.id,
        post: {
          slug: this.slug,
          date: new Date(this.date.year, this.date.month - 1, this.date.day, this.date.hour, this.date.minute, this.date.second),
          category: this.category,
          tags: this.tags,
          cover: this.cover,
          hideOnIndex: this.hideOnIndex,
          insertCover: this.insertCover,
          outdatedWarning: this.outdatedWarning,
          notSafeForWork: this.notSafeForWork,
          password: this.password,
          body: this.body,
        },
      }).then(() => {
        alert('文章已更新');
        this.fetchPost(true);
      }).catch(e => {
        console.log(e);
        alert('会话过期，请手动刷新');
      });
    },
    createPost() {
      if (!this.slug) {
        alert('URL 名称是必须的！');
        return;
      }

      if (this.monaco) {
        this.currentEditingBody.content = this.monaco.getValue();
      }

      api.post.createPost({
        token: this.$store.state.token,
        post: {
          slug: this.slug,
          date: new Date(this.date.year, this.date.month - 1, this.date.day, this.date.hour, this.date.minute, this.date.second),
          category: this.category,
          tags: this.tags,
          cover: this.cover,
          hideOnIndex: this.hideOnIndex,
          insertCover: this.insertCover,
          outdatedWarning: this.outdatedWarning,
          notSafeForWork: this.notSafeForWork,
          password: this.password,
          body: this.body,
        },
      }).then(res => {
        alert('文章已创建。');
        this.$router.push(`/admin/post/edit/${res.id}`);
      }).catch(e => {
        alert('会话过期，请手动刷新');
      });
    },
    fetchPost (keepSelectedLanguage) {
      api.post.fetchPostById({ id: this.$route.params.id }).then(post => {
        this.slug = post.slug;
        this.category = post.category;
        this.cover = post.cover;
        this.id = post._id;
        this.tagsSet = new Set(post.tags);
        this.tags = [...this.tagsSet];
        this.hideOnIndex = post.hideOnIndex;
        this.insertCover = post.insertCover;
        this.outdatedWarning = post.outdatedWarning;
        this.notSafeForWork = post.notSafeForWork;
        this.password = post.password;
        this.body = post.body;

        (!keepSelectedLanguage) && this.$nextTick(() => {
          try {
            this.editingLanguage = this.body.filter(body => body.default)[0].language;
            if (this.monaco) {
              this.$nextTick(() => {
                this.monaco.setValue(this.currentEditingBody.content);
              });
            }
          } catch (_) {
          }
        });

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
    },
    onPasteFile (event) {
      const pastedItems = [...event.clipboardData.items];
      console.log(event.clipboardData.files);

      for (const item of pastedItems) {
        const file = item.getAsFile();
        this.uploadFile(file, event.target);
      }
    },
    onDropFile (event) {
      event.preventDefault();
      event.stopPropagation();
      const files = [...event.dataTransfer.files];

      files.forEach(file => this.uploadFile(file, event.target));
    },
    async uploadFile (file, target) {
      if (!file) {
        return;
      }

      const comment = `<!-- UPLOAD PLACEHOLDER ID ${this.uploadId++} -->`;
      const editorBackendIsTextArea = !this.monaco;
      let html = '';

      if (editorBackendIsTextArea) {
        target.setRangeText(comment);
      } else {
        const editor = this.monaco;
        const selection = editor.getSelection();
        const model = editor.getModel();

        editor.executeEdits('update-value', [{
          range: selection,
          text: comment,
          forceMoveMarkers: true
        }]);

        editor.setSelection(new window.monaco.Selection(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn + comment.length));
      }

      try {
        const response = await api.media.uploadFile({
          file,
          token: this.$store.state.token,
          convert: /\.(jpg|jpeg|png|webp|bmp)$/.test(file.name),
        });
        const filename = response.data.filename;

        if (/\.(jpg|jpeg|png|webp|bmp|svg)$/.test(filename)) {
          const alt = response.data.alternative;
          
          if (alt.jpeg || alt.webp) {
            const sources = [];
            
            alt.webp && sources.push(`  <source srcset="/api/media/${encodeURIComponent(alt.webp)}" type="image/webp">`);
            alt.jpeg && sources.push(`  <source srcset="/api/media/${encodeURIComponent(alt.jpeg)}" type="image/jpeg">`);

            html = `<picture>\n${sources.join('\n')}\n  <img src="/api/media/${encodeURIComponent(filename)}">\n</picture>`;
          } else {
            html = `<img src="/api/media/${encodeURIComponent(filename)}">`;
          }
        } else {
          html = `<a href="/api/media/${encodeURIComponent(filename)}">${file.name}</a>`;
        }
      } catch (ex) {
        console.error(ex);
      }

      if (editorBackendIsTextArea) {
        const begin = target.value.indexOf(comment);
        const end = begin + comment.length;
        
        target.setRangeText(html, begin, end);
        target.setSelectionRange(begin + html.length, begin + html.length);

        const event = document.createEvent('HTMLEvents');
        event.initEvent('input', false, true);

        this.$refs.textarea.forEach(el => {
          el.dispatchEvent(event);
        });
      } else {
        const editor = this.monaco;
        const value = editor.getValue();
        const position = editor.getModel().getPositionAt(value.indexOf(comment));
        editor.executeEdits('update-value', [{
          range: new window.monaco.Selection(position.lineNumber, position.column, position.lineNumber, position.column + comment.length),
          text: html,
          forceMoveMarkers: true
        }]);
      }
    }
  },
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
  div.monaco-inject {
    border: 1px solid #ccc;
    height: 600px;
  }
  button {
    font-size: 12px;
    margin-right: 2px;
  }
}
</style>