<template lang="pug">
  div.card.gallery-manage
    h3.title 管理 Gallery
    .content
      div(v-if="editing === null")
        ul.image-list
          li(v-for="image in images" @click="edit(image._id)") {{ image.title }}
          li(@click="edit(undefined)") 添加
      div(v-else): table.form-table
        tr
          td.label 标题
          td: input.full(v-model="image.title")
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
          td.label 图片 URL
          td: input.full(v-model="image.cover")
        tr
          td.label 简介
          td: textarea(v-model="image.description")
        tr
          td.label 链接
          td: input.full(v-model="image.href")
        tr
          td.label 标签：
          td: span(v-for="(tag, idx) in arraylize(image.tags)" @click="deleteTag(tag)") {{ '#' + tag }} 
        tr
          td.label 常用标签：
          td
            button.tag(v-for="tag in $store.state.tags" @click="addTag(tag.tag)") {{ tag.tag }}
            button.tag(@click="addTag(prompt('新标签叫啥呢？'))") +
        tr
          td.label
          td.full
            button(@click="back") BACK
            button(@click="update") SUBMIT
            button.red.right(v-if="typeof this.editing !== 'undefined'" @click="remove") DELETE
</template>

<script>
import axios from 'axios';

export default {
  name: 'GalleryAdmin',
  data () {
    return {
      editing: null,
      image: {},
      date: {},
    };
  },
  computed: {
    images () {
      return this.$store.state.gallery.images;
    }
  },
  created () {
    if (this.$store.state.token === '') {
      this.$router.push('/admin');
      return;
    }
    this.$store.commit('setBusy', false);
    this.$store.dispatch('fetchTags');
    this.fetchImages();
  },
  methods: {
    fetchImages () {
      return this.$store.dispatch('fetchImages');
    },
    back () {
      this.fetchImages();
      this.editing = null;
    },
    addTag (tag) {
      if (!this._tags) this._tags = new Set();
      this._tags.add(tag);
      this.image.tags = [...this._tags];
    },
    deleteTag (tag) {
      this._tags.delete(tag);
      this.image.tags = [...this._tags];
    },
    arraylize (set) {
      return [...set];
    },
    prompt (string) {
      return window.prompt(string);
    },
    update () {
      const image = {
        title: this.image.title,
        description: this.image.description,
        cover: this.image.cover,
        tags: this.image.tags,
        href: this.image.href,
        date: new Date(this.date.year, this.date.month - 1, this.date.day, this.date.hour, this.date.minute, this.date.second),
      };
      if (this.editing === undefined) {
        // Create new image.
        this.$store.dispatch('createImage', image).then(() => {
          alert('创建成功！');
          this.back();
        });
      } else {
        image._id = this.image._id;
        this.$store.dispatch('updateImage', image).then(() => {
          alert('修改成功！');
          this.back();
        });
      }
    },
    remove () {
      this.$store.dispatch('removeImage', this.image._id).then(() => {
        alert('删除成功！');
        this.back();
      });
    },
    edit (id) {
      this.editing = id;
      let date;
      if (id === undefined) {
        this.image = {
          cover: '',
          title: '',
          description: '',
          tags: [],
          href: '',
        };
        date = new Date();
      } else {
        this.image = this.images.filter(image => image._id === id)[0];
        date = new Date(this.image.date);
      }
      this.date = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds()
      };
      this._tags = new Set(this.image.tags);
    },
  }
};
</script>


<style lang="scss">
@import '../../../src/style/form-table.scss';

.gallery-manage {
  .content {
    padding: 1em;
  }

  ul.image-list > li {
    color: darkgreen;
    cursor: pointer;
  }

  textarea {
    width: 100%;
    height: 8em;
  }

  button {
    font-size: 14px;
    margin-right: 5px;

    &.red {
      background: #c00;
    }
  }

  input.short {
    width: 2.5em;
  }

  button.tag {
    font-size: 12px;
    margin: 1px;
  }

  .right {
    float: right;
  }
}
</style>
