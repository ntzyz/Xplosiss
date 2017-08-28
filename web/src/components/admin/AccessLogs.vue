<template lang="pug">
  div.realtime-access-logs
    div.container
      span(v-for="log in logs") {{ log }}
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
    api.log.fetchLogs({ token: this.$store.state.token }).then(logs => {
      this.logs = logs;
      this.socket = io.connect(window.location.host, { path: `${config.api.url}/ws/` });
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
    height: 90vh;
    margin-top: 5vh;
    overflow-y: scroll;
    font-size: 0.8rem;
    span {
      display: block;
      margin-bottom: 0.2rem;
    }
  }
}
</style>
