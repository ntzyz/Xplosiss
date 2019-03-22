import api from '../api';

export default {
  fetchCategory: (state) => {
    return api.category.fetchCategoryList().then(categoryList => {
      state.commit('setCategories', categoryList);
    });
  },

  fetchTags: state => {
    return api.tag.fetchTagsList().then(tags => {
      state.commit('setTags', tags);
    });
  },

  fetchWidget: state => {
    return api.widget.fetchWidgetList().then(widgets => {
      state.commit('setWidgets', widgets);
    });
  },

  fetchPostsByCategory: (state, params) => {
    state.commit('setBusy', true);
    return api.category.fetchPostsByCategory(params).then(data => {
      state.commit('setPages', data.page);
      state.commit('setPosts', data.posts);
      state.commit('setBusy', false);
    });
  },

  fetchPostsByTag: (state, params) => {
    state.commit('setBusy', true);
    // state.commit('setPosts', []);
    return api.tag.fetchPostsByTag(params).then(data => {
      state.commit('setPages', data.page);
      state.commit('setPosts', data.posts);
      state.commit('setBusy', false);
    });
  },

  fetchLatestPosts: (state, params) => {
    state.commit('setBusy', true);
    // state.commit('setPosts', []);
    return api.post.fetchPosts(params).then(data => {
      state.commit('setPages', data.page);
      state.commit('setPosts', data.posts);
      state.commit('setBusy', false);
    });
  },

  fetchPostBySlug: (state, { slug, password, preferLanguage }) => {
    state.commit('setBusy', true);
    // state.commit('setPost', []);
    return api.post.fetchPostBySlug({ slug, password, preferLanguage }).then(post => {
      state.commit('setPost', post);
      state.commit('setBusy', false);
    });
  },

  fetchPageBySlug: (state, slug) => {
    state.commit('setBusy', true);
    // state.commit('setPage', {});
    return api.page.fetchPageBySlug({ slug }).then(page => {
      state.commit('setPage', page);
      state.commit('setBusy', false);
    });
  },

  fetchLatestReplies: state => {
    state.commit('setReplies', []);
    return api.reply.fetchLatestReplies().then(replies => {
      state.commit('setReplies', replies);
    });
  }
};
