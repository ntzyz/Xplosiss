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
          td.label 图片 URL
          td: input.full(v-model="image.cover")
        tr
          td.label 简介
          td: input.full(v-model="image.description")
        tr
          td.label 链接
          td: input.full(v-model="image.href")
        tr
          td.label Tags
          td: input.full(v-model="image.tags")
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
  name: 'gallery',
  data () {
    return {
      editing: null,
      image: {},
    };
  },
  created () {
    this.fetchImages();
  },
  computed: {
    images () {
      return this.$store.state.gallery.images;
    }
  },
  methods: {
    fetchImages () {
      return this.$store.dispatch('fetchImages');
    },
    back () {
      this.fetchImages();
      this.editing = null;
    },
    update () {
      if (this.editing === undefined) { // Create new image.
        this.$store.dispatch('createImage', this.image).then(() => {
          alert('创建成功！');
          this.back();
        });
      } else {
        this.$store.dispatch('updateImage', this.image).then(() => {
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
      if (id === undefined) {
        this.image = {
          cover: '',
          title: '',
          description: '',
          tags: '',
          href: '',
        };
      } else {
        this.image = this.images.filter(image => image._id === id)[0];
        this.image.tags = this.image.tags.join(' ');
      }
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

  button {
    font-size: 14px;
    margin-right: 5px;

    &.red {
      background: #c00;
    }
  }

  .right {
    float: right;
  }
}
</style>
