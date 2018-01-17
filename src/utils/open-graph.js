import config from '../config.json';

function getOpenGraph (vm) {
  const { openGraph } = vm.$options;
  if (openGraph) {
    return typeof openGraph === 'function'
      ? openGraph.call(vm)
      : openGraph;
  }
}

const serverOpenGraphMixin = {
  created () {
    const og = getOpenGraph(this);
    if (og) {
      this.$ssrContext.og = Object.assign(this.$ssrContext.og || {}, og);
    }
  }
};

const clientOpenGraphMixin = {};

export default process.env.VUE_ENV === 'server'
  ? serverOpenGraphMixin
  : clientOpenGraphMixin;
