var scrollTopStack = [];
function changeURL(url, noAnime){
    scrollTopStack.push(document.getElementsByTagName('body')[0].scrollTop);
    window.history.pushState({},0,'http://'+window.location.host+'/'+url);
    $("html, body").animate({ scrollTop: 0 }, "fast");
}
window.onpopstate = function(e){
    $('.main').fadeOut(100, function() {
        vm.isPopState = true;
        vm.init();
        vm.isPopState = false;
        $("html, body").animate({ scrollTop: scrollTopStack.pop() }, "fast");
    })
};

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
        isPopState: false,
        isFirstLoad: true
    },
    created: function () {
        this.init();
    },
    methods: {
        init: function() {
            var url = window.location.pathname;
            this.initCommon();
            this.initWidgets();
            this.initCategory();
            if (url !== '/') {
                if (url[url.length - 1] == '/') {
                    url = url.substr(0, url.length - 1);
                }
                if (url[6] == 'i') {
                    this.viewPostById(url.substr(url.indexOf('=') + 1));
                }
                else if (url[6] == 'c') {
                    this.getPostByCategory(url.substr(url.indexOf('=') + 1));
                }
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
                if (window.location.pathname == '/')
                    vm.getPostByCategory(null);
            });
        }, // initCategory
        getPostByCategory: function(category_id) {
            var url;
            if (!category_id) {
                url = "/api/post/all?page=" + this.currentPage;
            }
            else {
                url = "/api/post/byCategoryId?page=" + this.currentPage + '&category_id=' + category_id;
            }
            $.ajax({
                url: url,
                type: "GET",
                beforeSend: function() {
                    if (category_id || !vm && !vm.isPopState) {
                        changeURL('post/category=' + category_id);
                    }
                    $('.main').fadeOut(10)
                }
            }).done(function (data) {
                $('.main').fadeIn(300)
                vm.post = JSON.parse(data);
            });
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
            $.ajax({
                url: "/api/post/byPostId?post_id=" + id,
                type: "GET",
                beforeSend: function() {
                    changeURL('post/id=' + id);
                    $('.main').fadeOut(10)
                }
            }).done(function (data) {
                $('.main').fadeIn(300)
                vm.post = JSON.parse(data);
            });
        }, // viewPostById
    }
});
