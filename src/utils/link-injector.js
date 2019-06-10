const clickEventMixin = {
  methods: {
    linkEventHandler (event) {
      if (event.which !== 1) {
        return; // Capture left click only.
      }
      let target = event.target;
      while (target !== null && target.tagName !== 'A') {
        target = target.parentNode;
      }
      if (target && target.href && target.href.indexOf(window.location.origin) === 0 && target.getAttribute('inject') !== 'no') {
        event.preventDefault();
        let url = new window.URL(target.href);
        this.$router.push(url.href.replace(url.origin, ''));
      }
    }
  }
};

export default clickEventMixin;
