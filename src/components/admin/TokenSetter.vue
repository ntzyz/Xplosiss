<template lang="pug">
  div.token-setter
    div(v-show="$store.state.token === ''")
      h2 需要认证
      div(style="margin-bottom: 20px") 请输入你的管理 token，查看服务器日志以获得：
      div
        input(placeholder="管理 token" v-model="token")
      div
        button(@click="check") CONTINUE
        button(@click="forgot") I FORGOT
    div(v-show="$store.state.token !== ''") 
      h2 身份已认证
      div 在左侧选择任务以继续。
</template>

<script>
import api from '../../api';

export default {
  name: 'TokenSetter',
  data () {
    return {
      token: '',
    };
  },
  watch: {
    '$route': function () {
      if (this.$route.query.logout === 'true') {
        window.localStorage.token = '';
        this.$store.commit('setToken', '');
        this.$router.push({ query: {}});
      }
    }
  },
  mounted () {
    this.$store.commit('setBusy', false);
    if (this.$route.query.logout === 'true') {
      window.localStorage.token = '';
      this.$store.commit('setToken', '');
      this.$router.push({ query: {}});
    } else {
      console.log(this.$store.state.token);
      this.$nextTick(() => {
        this.token = window.localStorage.token;
        this.check(true);
      })
      // if (window.localStorage.token) {
      //   this.token = window.localStorage.token;
      //   this.$nextTick(() => { 
      //     this.$store.commit('setToken', window.localStorage.token);
      //     this.check(true);
      //   });
      // }
    }
  },
  methods: {
    check (noalert = false) {
      api.token.checkToken(this.token).then(result => {
        if (!result) {
          noalert || alert('验证失败！');
          this.$store.commit('setToken', '');
        } else {
          this.$store.commit('setToken', this.token);
          window.localStorage.token = this.token;
        }
      });
    },
    forgot () {
      api.token.forgotToken().then(() => {
        alert('查看服务器输出以获得 token。');
      });
    },
  }
};
</script>

<style lang="scss">
@import '../../style/global.scss';

.token-setter {
  text-align: center;
  padding: 20vh 0;

  input {
    width: 250px;
  }
  button {
    margin: 5px;
    font-size: 14px;
  }
}

</style>