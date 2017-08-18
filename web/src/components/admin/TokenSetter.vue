<template lang="pug">
  div.token-setter
    div(v-if="$store.state.token === ''")
      h2 需要认证
      div(style="margin-bottom: 20px") 请输入你的管理 token，查看服务器日志以获得：
      div
        input(placeholder="管理 token" v-model="token")
        button(@click="check") 确定
        button(@click="forgot") 我不记得了
    div(v-else) 
      h2 身份已认证
      div 在左侧选择任务以继续。
</template>

<script>
import api from '../../api';

export default {
  name: 'token-setter',
  created () {
    this.$store.commit('setBusy', false);
  },
  data () {
    return {
      token: '',
    }
  },
  methods: {
    check () {
      api.token.checkToken(this.token).then(result => {
        if (!result) {
          alert('验证失败！');
        } else {
          this.$store.commit('setToken', this.token);
        }
      })
    },
    forgot () {
      api.token.forgotToken().then(() => {
        alert('查看服务器输出以获得 token。');
      })
    },
  }
};
</script>

<style lang="scss">
@import '../../style/global.scss';

.token-setter {
  text-align: center;
  padding-top: 20vh;

  input {
    width: 250px;
  }
}

</style>