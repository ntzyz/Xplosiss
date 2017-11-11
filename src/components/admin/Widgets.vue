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
      table.form-table
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
            button(@click="back") RETURN
            button(@click="save") SAVE
            button.right(@click="deleteWidget") DELETE
</template>

<script>
import api from '../../api';

export default {
  data () {
    return {
      editing: null,
      widgets: [],
      selected: null,
    };
  },
  methods: {
    fetchWidgets () {
      api.widget.fetchWidgetList({ all: true }).then(widgets => {
        this.widgets = widgets;
      });
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
        });
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
        });
      }
    },
    deleteWidget () {
      if (confirm('该操作不可撤销，确认继续？')) {
        api.widget.deleteWidget({ token: this.$store.state.token, id: this.editing._id }).then(() => {
          alert('删除成功');
          this.back();
        });
      }
    }
  },
  mounted () {
    if (this.$store.state.token === '') {
      this.$router.push('/admin');
    } else {
      this.$store.commit('setBusy', false);
      this.fetchWidgets();
    }
  },
  beforeDestroy () {
    document.querySelector('#app').style.maxWidth = '';
  }
};
</script>

<style lang="scss">
@import '../../style/form-table.scss';

div.widgets-manage {
  input.short {
    width: 2.5em;
  }
  button.tag {
    margin-right: 4px;
    margin-bottom: 4px;
  }
  button:not(.tag) {
    margin: 4px;
    font-size: 14px;
  }
  button.right {
    float: right;
    background-color: mix(red, black, 80%);
  }
}

</style>