export function pluginInstaller ({ app, router, store, coreComponents, config }) {
  if (process.env.VUE_ENV !== 'server') {
    const audioEffect = new Audio();
    audioEffect.src = config.plugins['navigation-sound'].audioURL;
    audioEffect.loop = false;
  
    router.beforeResolve((to, from, next) => {
      audioEffect.play();
      next();
    });
  }

  return Promise.resolve();
}

export default pluginInstaller;
