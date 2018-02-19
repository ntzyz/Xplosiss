<template lang="pug">
  div.realtime-access-logs.card
    h3.title 实时日志
    div.container
      pre: span(v-for="log in logs" class="__line") {{ log }}
</template>

<script>
import io from 'socket.io-client';
import config from '../../config.json';
import api from '../../api';

export default {
  name: 'AccessLogs',
  data () {
    return {
      socket: null,
      logs: [],
      logsText: '',
    };
  },
  mounted () {
    if (this.$store.state.token === '') {
      this.$router.push('/admin');
      return;
    }
    this.$store.commit('setBusy', false);
    api.log.fetchLogs({ token: this.$store.state.token }).then(logs => {
      const url = new URL(config.api.url + '/ws');
      this.logs = logs;
      this.socket = io.connect(url.origin, { path: url.pathname, query: `token=${this.$store.state.token}` });
      this.socket.on('log', text => { 
        this.logs.push(text);
        console.log('here');
        setTimeout(() => {
          let list = document.querySelector('div.container');
          list.scrollTop = list.scrollHeight;
        }, 0);
      });
    });
  },
  beforeDestroy () {
    this.socket && this.socket.disconnect();
  }
};
</script>

<style lang="scss">
div.realtime-access-logs {
  div.container {
    height: 85vh;
    font-size: 0.9rem;
    overflow: scroll;
    pre {
      margin: 0;
      padding: 1em 0 1em 0;
      overflow: visible;
      background-color: white;
    }
    span {
      display: block;
      // margin-bottom: 0.2rem;
    }
  }
}
</style>
