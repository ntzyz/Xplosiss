export default {
  beforeRouteLeave (to, from, next) {
    if (confirm('确实要跳转吗？修改可能没有保存。')) {
      next();
    } else {
      next(false);
    }
  }
}