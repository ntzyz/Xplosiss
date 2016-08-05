var scrollTopStack = [];

function AJAX(data) {
    var xhr = new XMLHttpRequest();
    if (data.url.indexOf('?') >= 0) {
        xhr.open(data.type, data.url + '&time=' + (new Date()).getTime());
    }
    else {
        xhr.open(data.type, data.url + '?time=' + (new Date()).getTime());
    }

    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4) {
            if (xhr.status === 200 && data.done) {
                data.done(xhr.responseText);
            }
            else {
                console.error('Ajax Error: ', xhr.status);
            }
        }
    }

    if (data.before) {
        data.before();
        xhr.send();
    }
    else {
        xhr.send();
    }
}

Vue.component('card', {
    props: ['content'],
    template: [
        '<div class="card">',
            '<div class="card-content">',
                '{{{content}}}',
            '</div>',
        '</div>'
    ].join('\n')
});

Vue.component('post', {
    props: ['post_title', 'post_date', 'post_category', 'post_content', 'post_id', 'disp'],
    template: [
        '<div style="margin-bottom: 80px;">',
            '<h3 class="post_title" onclick="vm.readMoreClick({{post_id}})">{{{post_title}}}</h3>',
            '<div class="meta"><img src="/cate.png" class="metaicon" />{{{post_category}}}</div>', 
            '<div class="meta"><img src="/date.png" class="metaicon" />{{{post_date}}}</div>', 
            '<div class="row">', 
                '<p>{{{post_content}}}</p>',
            '</div>',
            '<a class="waves-effect waves-teal btn-flat right" v-bind:style="{display: disp};" onclick="vm.readMoreClick({{post_id}})">Read more</a>',
        '</div>'
    ].join('\n')
});

var vm = new Vue({
    el: 'body',
    data: {
        blog_title: null,
        blog_subtitle: null,
        category: [],
        currentCategoryId: null,
        currentPage: 0,
        maxPage: 0,
        widget: [],
        post: [],
        isPopState: false,
        isFirstLoad: true,
        isLoading: true
    },
    created: function () {
        this.init();
    },
    methods: {
        init: function() {
            $('.main').fadeOut(10);

            if ((location.pathname + location.search).substr(1).indexOf('/?') >= 0) {
                // fix situation like: post/category=2/?page=1
                var href = (location.pathname + location.search).substr(1).replace(/\/\?/, '?');
                replaceUrl(href);
            }

            var url = window.location.pathname;
            if (url[url.length - 1] == '/' && url.length != 1) {
                url = url.substr(0, url.length - 1);
                replaceUrl(url.substr(1));
            }

            if (_GET('page')) {
                this.currentPage = _GET('page') - 1;
            }

            if (this.isFirstLoad) {
                this.initCommon();
                this.initWidgets();
                this.isFirstLoad = false;
            }
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
        }, // init
        initCommon: function() {
            AJAX({
                url: '/api/common',
                type: 'GET',
                done: function (data) {
                    res = JSON.parse(data);
                    vm.blog_title = res.title;
                    vm.blog_subtitle = res.subtitle;
                }
            });
        }, // initCommon
        initCategory: function () {
            AJAX({
                url: '/api/category/list',
                type: 'GET',
                before: function () {
                    this.category = ['...'];
                },
                done: function (data) {
                    vm.category = JSON.parse(data);
                    if (window.location.pathname == '/')
                        vm.getPostByCategory(null);
                }
            })
        }, // initCategory
        getPostByCategory: function(category_id, append) {
            var url;
            currentCategoryId = category_id;

            if (!category_id) {
                url = "/api/post/all?page=" + this.currentPage;
            }
            else {
                url = "/api/post/byCategoryId?page=" + this.currentPage + '&category_id=' + category_id;
            }

            AJAX({
                url: url,
                type: 'GET',
                done: function (data) {
                    vm.isLoading = false;
                    res = JSON.parse(data);
                    if (!append) {
                        vm.post = res.table;
                        vm.maxPage = res.max_pages;
                        $('.main').fadeIn(300);
                    }
                    else {
                        vm.isLoading = false;
                        //vm.post = vm.post.concat(res.table);
                        vm.post = res.table;
                    }
                    if (vm.isPopState) {
                        scrollTo(scrollTopStack.pop());
                        vm.isPopState = false;
                    }
                }
            });
        }, // getPostByCategory
        initWidgets: function() {
            AJAX({
                url: '/api/widget',
                type: 'GET',
                done: function (data) {
                    vm.widget = JSON.parse(data);
                }
            });
        }, // initWidgets
        viewPostById: function (id) {
            AJAX({
                url: '/api/post/byPostId?post_id=' + id,
                type: 'GET',
                done: function (data) {
                    $('.main').fadeIn(300);
                    vm.post = JSON.parse(data);
                    vm.isLoading = false;
                }
            });
        }, // viewPostById
        more: function() {
            if (vm.currentPage + 1 >= vm.maxPage || window.location.pathname[6] == 'i')
                return;

            this.isLoading = true;
            vm.currentPage++;
            var newUrl = '';
            if (vm.currentCategoryId) {
                newUrl = newUrl + 'post/category=' + vm.currentCategoryId;
            }
            newUrl = newUrl + '?page=' + (this.currentPage + 1);
            replaceUrl(newUrl);
            vm.getPostByCategory(vm.currentCategoryId, true);
        }, // more
        reset: function () {
            this.isLoading = true;
            this.post = [];
            pushUrl('');
            this.currentPage = 0;
            this.currentCategoryId = null;
            this.init();
        },
        categoryClick: function (category_id) {
            $('.main').fadeOut(10);
            this.isLoading = true;
            this.post = [];
            this.currentCategoryId = category_id;
            this.currentPage = 0;
            pushUrl('post/category=' + category_id + '?page=' + (this.currentPage + 1));
            this.getPostByCategory(category_id)
        },
        readMoreClick: function(id) {
            $('.main').fadeOut(10);
            this.isLoading = true;
            this.post = [];
            pushUrl('post/id=' + id);
            this.viewPostById(id);
        }
    }
});

window.onscroll = function() {
    if(!vm.isLoading 
        && document.documentElement.scrollHeight - window.innerHeight > 0 
        && document.documentElement.scrollHeight >= document.documentElement.scrollHeight - window.innerHeight * 2) {
        vm.more();
    }
};

function pushUrl(url, noAnime){
    scrollTopStack.push(window.scrollY);
    window.history.pushState({}, 0, '//' + window.location.host + '/' + url);
    scrollTo(0);
}

function replaceUrl(url, noAnime){
    window.history.replaceState({}, 0, '//' + window.location.host + '/' + url);
}

function scrollTo(position, callback) {
    $('html, body').animate({
        scrollTop: position
    }, 200);
}

window.onpopstate = function(e) {
    e.preventDefault();
    vm.isLoading = true;
    $('.main').fadeOut(10, function() {
        vm.isPopState = true;
        vm.init();
    })
};

function _GET(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
