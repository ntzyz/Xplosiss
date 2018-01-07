import { createApp } from './app.js';
import config from './config.json';

createApp().then(({ app, store, router }) => {
  if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__);
  }
  
  router.onError((error) => {
    console.log(error);
    app.$forceUpdate();
    router.replace('/not-found');
    app.$forceUpdate();
  });

  router.onReady(() => {
    router.beforeEach((to, from, next) => {
      if (store.state.forceReload) {
        window.location.href = to.fullPath;
      } else {
        next();
      }
    });
  
    router.beforeResolve((to, from, next) => {
      const matched = router.getMatchedComponents(to);
      const prevMatched = router.getMatchedComponents(from);
  
      const activated = matched.filter((c, i) => {
        return prevMatched[i] !== c;
      });
  
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
      }).catch((error) => {
        next(error);
      });
    });
  
    console.log(`You are using Xplosiss-git(${process.env.COMMIT || 'unknown'})${process.env.COMMIT && `\nAbout this commit: https://github.com/ntzyz/new-blog/commit/${process.env.COMMIT}`}`);
  
    app.$mount('#app');
  });
});
