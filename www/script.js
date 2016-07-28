Vue.component('card', {
  props: ['content'],
  template: '<div class="card"><div class="card-content">{{{content}}}</div></div>'
});

Vue.component('post', {
  props: ['post_title', 'post_date', 'post_category', 'post_content', 'post_id', 'disp'],
  template: '<div style="margin-bottom: 80px;"><h3 class="post_title">{{{post_title}}}</h3><div class="meta"><img src="https://blog.dimension.moe/wp-content/themes/skymile/assets/imgs/cate.png" class="metaicon" />{{{post_category}}}</div><div class="meta"><img src="https://blog.dimension.moe/wp-content/themes/skymile/assets/imgs/date.png" class="metaicon" />{{{post_date}}}</div><div class="row"><p>{{{post_content}}}</p></div><a class="waves-effect waves-teal btn-flat right" v-bind:style="{display: disp};" onclick="vm.viewPostById({{post_id}})">Read more</a></div>'
});

var vm = new Vue({
    el: 'body',
    data: {
        blog_title: null,
        blog_subtitle: null,

        category: [],
        currentCategoryId: null,
        currentPage: 0,

        widget: [],

        post: [],
    },
    created: function () {
        this.init();
    },
    methods: {
        init: function() {
            var url = window.location.pathname;
            this.initCommon();
            this.initWidgets();
            if (url == '/') {
                this.initCategory();
            }
            else if (url[1] == 'p') {
                this.viewPostById(url.substr(url.indexOf('=') + 1));
            }
        },
        initCommon: function() {
            $.ajax({
                url: "/api/common",
                type: "GET"
            }).done(function (data) {
                res = JSON.parse(data);
                vm.blog_title = res.title;
                vm.blog_subtitle = res.subtitle;
            });
        }, // initCommon
        initCategory: function () {
            $.ajax({
                url: "/api/category/list",
                type: "GET",
                beforeSend: function () {
                    this.category = ['...'];
                }
            }).done(function (data) {
                vm.category = JSON.parse(data);
                vm.getPostByCategory(vm.currentCategoryId);
            });
        }, // initCategory
        getPostByCategory: function(category_id) {
            if (!category_id) {
                $.ajax({
                    url: "/api/post/all?page=" + vm.currentPage,
                    type: "GET",
                }).done(function (data) {
                    vm.post = JSON.parse(data);
                });
            }
            else {
                console.log('Now showing all posts under category ', category_id);
            }
        }, // getPostByCategory
        initWidgets: function() {
            $.ajax({
                url: "/api/widget",
                type: "GET",
            }).done(function (data) {
                vm.widget = JSON.parse(data);
            });
        }, // initWidgets
        viewPostById: function (id) {
            console.log("/api/post/byPostId?post_id=" + id);
            $.ajax({
                url: "/api/post/byPostId?post_id=" + id,
                type: "GET",
            }).done(function (data) {
                vm.post = JSON.parse(data);
                changeURL('post/id=' + id);
            });
        }, // viewPostById
    }
});

function changeURL(url){
    window.history.pushState({},0,'http://'+window.location.host+'/'+url);
    $("html, body").animate({ scrollTop: 0 }, "fast");
}
window.onpopstate = function(e){
    vm.init();
};