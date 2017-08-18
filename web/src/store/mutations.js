export default {
  setCategories: (state, categories) => {
    state.categories = categories;
  },
  setTags: (state, tags) => {
    state.tags = tags;
  },
  setPosts: (state, posts) => {
    state.posts = posts;
    // setTimeout(() => { state.posts = posts; }, 300);
  },
  setPost: (state, post) => {
    state.post = post;
    // setTimeout(() => { state.post = post; }, 300);
  },
  setPages: (state, pages) => {
    state.pages = pages;
  },
  setBusy: (state, isBusy) => {
    state.busy = isBusy;
    // setTimeout(() => { state.busy = isBusy; }, isBusy ? 0 : 300);
  },
  setWidgets: (state, widgets) => {
    state.widgets = widgets;
  },
  enableForceReload: state => {
    state.forceReload = true;
  },
  setToken: (state, token) => {
    state.token = token;
  }
}
