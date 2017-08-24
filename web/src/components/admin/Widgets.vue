<template lang="pug">
  div.widgets-manage
    div(v-if="editing === null")
      h2 从列表中选择一个待编辑的工具
      select.widget-picker(v-model="selected")
        option(v-for="widget in widgets" :value="widget._id") {{ widget.title }}
        option(:value="null") 创建一个新的小工具
      button.widget-edit-button(@click="editWidget(selected)") 继续
    div(v-else)
      h2 创建/编辑工具
      table
        tr
          td.label 标题：
          td: input.full(v-model="editing.title")
        tr
          td.label HTML：
          td: textarea.content(v-model="editing.content")
        tr
          td.label 启用：
          td: input(type="checkbox" v-model="editing.enabled")
        tr
          td.label
          td
            button(@click="back") 返回
            button(@click="save") 保存
</template>

<script>
import api from '../../api';

export default {
  data () {
    return {
      editing: null,
      widgets: [],
      selected: null,
    }
  },
  methods: {
    fetchWidgets () {
      api.widget.fetchWidgetList({ all: true }).then(widgets => {
        this.widgets = widgets;
      })
    },
    editWidget () {
      this.editing = Object.assign({
        title: '',
        content: '',
        enabled: false,
      }, this.widgets.filter(widget => widget._id === this.selected)[0]);
      document.querySelector('#app').style.maxWidth = 'initial';
    },
    back () {
      this.editing = null;
      this.fetchWidgets();
      document.querySelector('#app').style.maxWidth = '';
    },
    save () {
      if (this.editing._id) {
        // update
        api.widget.updateWidget({
          id: this.editing._id,
          widget: this.editing,
          token: this.$store.state.token,
        }).then(() => {
          alert('更新成功');
          this.back();
        }).catch(e => {
          alert('会话过期，请手动刷新');
        })
      } else {
        // create
        api.widget.createWidget({
          widget: this.editing,
          token: this.$store.state.token,
        }).then(() => {
          alert('创建成功');
          this.back();
        }).catch(e => {
          alert('会话过期，请手动刷新');
        })
      }
    }
  },
  created () {
    this.fetchWidgets();
  },
  beforeDestroy () {
    document.querySelector('#app').style.maxWidth = '';
  }
}
</script>

<style lang="scss">

div.widgets-manage {
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
    word-wrap: break-word;
    word-break: break-all;
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