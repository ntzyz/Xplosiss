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
    const matched = router.getMatchedComponents(to);
    const prevMatched = router.getMatchedComponents(from);
    let diffed = false;
    
    const activated = matched.filter((c, i) => {
      return prevMatched[i] !== c;
    })
    if (!activated.length) {
      return next();
    }

    const componentsWithAsyncData = [];
    const checkComponent = C => {
      if (C.asyncData) {
        componentsWithAsyncData.push(C);
      }
      if (C.components) {
        Object.keys(C.components).forEach(name => {
          checkComponent(C.components[name]);
        });
      }
    };
    
    activated.forEach(C => {
      checkComponent(C);
    });

    Promise.all(componentsWithAsyncData.map(c => {
      if (c.asyncData) {
        return c.asyncData({ store, route: to });
      }
    })).then(() => {
      next();
    }).catch(next);
  })

  app.$mount('#app');
});
