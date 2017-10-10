import Vue from 'vue';
import { createApp } from './app.js';

const { app, store, router } = createApp();

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

router.onReady(() => {
  router.beforeEach((to, from, next) => {
    if (store.state.forceReload) {
      window.location.href = to.fullPath;
    } else {
      next();
    }
  });
  
  // Vue.mixin({
  //   beforeMount () {
  //     const { asyncData } = this.$options;
  //     console.log(this)
  //     if (asyncData) {
  //       this.dataPromise = asyncData({
  //         store: this.$store,
  //         route: this.$route
  //       }).catch(error => {
  //         if (error.response.status === 404) {
  //           this.$router.replace('/not-found');
  //         }
  //       });
  //     }
  //   }
  // });

  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)
    // 我们只关心之前没有渲染的组件
    // 所以我们对比它们，找出两个匹配列表的差异组件
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })
    if (!activated.length) {
      return next()
    }
    // 这里如果有加载指示器(loading indicator)，就触发
    Promise.all(activated.map(c => {
      if (c.asyncData) {
        return c.asyncData({ store, route: to })
      }
    })).then(() => {
      // 停止加载指示器(loading indicator)
      next()
    }).catch(next)
  })

  app.$mount('#app');
});
