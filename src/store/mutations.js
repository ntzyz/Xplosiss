export default {
  setCategories: (state, categories) => {
    state.categories = categories;
  },
  setTags: (state, tags) => {
    state.tags = tags;
  },
  setPosts: (state, posts) => {
    state.posts = posts;
  },
  setPost: (state, post) => {
    state.post = post;
  },
  setPages: (state, pages) => {
    state.pages = pages;
  },
  setBusy: (state, isBusy) => {
    state.busy = isBusy;
  },
  setWidgets: (state, widgets) => {
    state.widgets = widgets;
  },
  enableForceReload: state => {
    state.forceReload = true;
  },
  setToken: (state, token) => {
    if (process.env.VUE_ENV !== 'server') {
      window.localStorage.token = token;
    }
    state.token = token;
  },
  setPage: (state, page) => {
    state.page = page;
  },
  setReplies: (state, replies) => {
    state.replies = replies;
  }
}
