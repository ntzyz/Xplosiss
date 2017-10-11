<template lang="pug">
  div.realtime-access-logs
    h2 实时日志
    div.container
      pre: span(v-for="log in logs" class="__line") {{ log }}
</template>

<script>
import io from 'socket.io-client';
import config from '../../config.js';
import api from '../../api';

export default {
  name: 'access-logs',
  data () {
    return {
      socket: null,
      logs: [],
      logsText: '',
    }
  },
  created () {
    if (this.$store.state.token === '') {
      this.$router.push('/admin');
      return;
    }
    this.$store.commit('setBusy', false);
  },
  beforeMount () {
    api.log.fetchLogs({ token: this.$store.state.token }).then(logs => {
      this.logs = logs;
      console.log("Trying to establish websocket connection.")
      this.socket = io.connect(window.location.host, { path: `/api/ws/`, query: `token=${this.$store.state.token}` });
      this.socket.on('connect_error', err =>{
        console.log(err);
      });
      console.log(this.socket);
      this.socket.on('log', text => {
        this.logs.push(text);
        setTimeout(() => {
          let list = document.querySelector('div.container');
          list.scrollTop = list.scrollHeight;
        }, 0)
      })
    })
  },
  beforeDestroy () {
    this.socket && this.socket.disconnect();
  }
}
</script>

<style lang="scss">
div.realtime-access-logs {
  div.container {
    height: 85vh;
    font-size: 0.9rem;
    overflow: scroll;
    pre {
      margin: 0;
      padding: 0;
      overflow: visible;
    }
    span {
      display: block;
      // margin-bottom: 0.2rem;
    }
  }
}
</style>
