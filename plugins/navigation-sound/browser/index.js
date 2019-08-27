export function pluginInstaller ({ app, router, store, coreComponents, config }) {
  // Disable when server rendering
  if (process.env.VUE_ENV === 'server') {
    return;
  }

  // Disable for mobile devices, as playing sound on these devices may
  // activate the global media control widget/notification
  // Also disable for Internet Explorer, see #12
  if (/(iPhone|IEMobile|Mobile|Android|Trident)/.test(navigator.userAgent)) {
    return;
  }

  const audioEffect = new Audio();
  audioEffect.src = config.plugins['navigation-sound'].audioURL;
  audioEffect.loop = false;

  router.beforeResolve((_to, _from, next) => {
    audioEffect.play().catch(_error => { /* actually we do NOT care what happened. */ });
    next();
  });

  return Promise.resolve();
}

export default pluginInstaller;
