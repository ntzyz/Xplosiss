import config from '../config.json';

function getTitle (vm) {
  const { title } = vm.$options;
  if (title) {
    return typeof title === 'function'
      ? title.call(vm)
      : title;
  }
}

const serverTitleMixin = {
  created () {
    const title = getTitle(this);
    if (title) {
      this.$ssrContext.title = `${title} - ${config.title}`;
    }
  }
};

const clientTitleMixin = {
  mounted () {
    const title = getTitle(this);
    if (title) {
      document.title = `${title} - ${config.title}`;
    }
  },
  watch: {
    '$route': function () {
      const updateTitle = function () {
        const title = getTitle(this);
        if (title) {
          document.title = `${title} - ${config.title}`;
        }  
      }.bind(this);

      this.$nextTick(() => {
        if (this.promise) {
          this.promise.then(() => {
            updateTitle();
          });
        } else {
          updateTitle();
        }
      });
    }
  }
};

export default process.env.VUE_ENV === 'server'
  ? serverTitleMixin
  : clientTitleMixin;
