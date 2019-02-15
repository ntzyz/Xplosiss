import { createApp } from './app.js';
import config from './config.json';

createApp({
  Vue: window.Vue,
  VueRouter: window.VueRouter,
  Vuex: window.Vuex,
}).then(({ app, store, router }) => {
  if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__);
  }

  if (window.localStorage.token !== undefined) {
    store.commit('setToken', window.localStorage.token);
  }
  
  router.onError((error) => {
    console.log(error);
    app.$forceUpdate();
    router.replace('/not-found');
    setTimeout(() => {
      app.$forceUpdate();
    }, 1000);
  });

  router.onReady(() => {
    router.beforeEach((to, from, next) => {
      if (store.state.forceReload) {
        window.location.href = to.fullPath;
      } else {
        next();
      }
    });

    const audioEffect = new Audio();
    audioEffect.src = '/Windows%20Navigation%20Start.aac';
    audioEffect.loop = false;
  
    router.beforeResolve((to, from, next) => {
      audioEffect.play();

      const matched = router.getMatchedComponents(to);
      const prevMatched = router.getMatchedComponents(from);
  
      const activated = matched.filter((c, i) => {
        return prevMatched[i] !== c;
      });
  
      if (!activated.length) {
        return next();
      }
  
      const componentsWithAsyncData = [];
      const checkedCompoments = [];
      const checkComponent = C => {
        if (checkedCompoments.indexOf(C) >= 0) {
          return;
        }
        checkedCompoments.push(C);
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
          const promise = c.asyncData({ store, route: to });

          return promise;
        }
      })).then(() => {
        next();
      }).catch((error) => {
        // We couldn't handle error here as `router.replace` will make components 'disappear'
        // on Google Chrome and I don't know why will this shit happen.
        // But server side rendering can redirect this page to error page like 404 not found
        // So we just reload here, leave this problem to the render server.
        window.location.href = router.resolve(to).href;
      });
    });
  
    console.log(`You are using Xplosiss-git(${process.env.COMMIT || 'unknown'})${process.env.COMMIT && `\nAbout this commit: https://github.com/ntzyz/new-blog/commit/${process.env.COMMIT}`}`);
  
    app.$mount('#app');
  });
});
