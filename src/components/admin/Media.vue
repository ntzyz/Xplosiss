<template lang="pug">
  div.media-manage.card
    h3.title 管理媒体文件
    .container
      button(@click="upload") UPLOAD NEW
      table
        tr
          th.filename 文件名
          th.mime MIME
          th.operation 操作
        tr(v-for="file in files")
          td.filename: span {{ file.file }}
          td.mime {{ file.mime || 'text/plain' }}
          td.operation 
            a(:href="getFileURL(file.file)" target="_blank") 预览
            a(@click="deleteFile(file.file)") 删除
      input(type="file" style="display: none")
</template>

<script>
import api from '../../api';

export default {
  name: 'Media',
  data () {
    return {
      files: [],
    };
  },
  created () {
    if (!this.$store.state.token) {
      this.$router.push('/admin');
      return;
    }
    this.$store.commit('setBusy', false);
    this.fetchFiles();
    this.$nextTick(() => {
      let input = document.querySelector('input[type="file"]');
      input.addEventListener('change', ev => {
        if (input.files && input.files[0]) {
          let file = input.files[0];
          api.media.uploadFile({ token: this.$store.state.token, file }).then(() => {
            this.fetchFiles();
          });
          input.value = '';
        }
      });
    });
  },
  methods: {
    getFileURL: api.media.getFileURL,
    fetchFiles () {
      api.media.fetchFiles({ token: this.$store.state.token }).then(files => {
        this.files = files.reverse();
      });
    },
    upload () {
      let input = document.querySelector('input[type="file"]');
      input.click();
    },
    deleteFile (file) {
      api.media.deleteFile({ token: this.$store.state.token, file }).then(() => {
        this.fetchFiles();
        alert('删除成功');
      });
    }
  }
};
</script>

<style lang="scss">
div.media-manage {
  overflow: hidden;
  .container {
    padding: 1em;
  }
  table {
    width: 100%;
    table-layout: fixed;
  }
  th {
    font-weight: 600;
  }
  .operation {
    width: 100px;
    text-align: center;
  }
  .mime {
    width: 150px;
    text-align: center;
  }
  .operation > a {
    margin-left: 5px;
  }
  td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre;
  }
  button {
    font-size: 14px;
    margin-top: 5px;
  }
}
</style>