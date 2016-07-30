var scrollTopStack = [];

function AJAX(data) {
    var xhr = new XMLHttpRequest();
    xhr.open(data.type, data.url);

    if (data.before) data.before();

    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4) {
            if (xhr.status === 200 && data.done) {
                data.done(xhr.responseText);
            }
            else {
                console.log('Ajax Error: ', xhr.status);
            }
        }
    }

    xhr.send();
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
            '<h3 class="post_title">{{{post_title}}}</h3>',
            '<div class="meta"><img src="/cate.png" class="metaicon" />{{{post_category}}}</div>', 
            '<div class="meta"><img src="/date.png" class="metaicon" />{{{post_date}}}</div>', 
            '<div class="row">', 
                '<p>{{{post_content}}}</p>',
            '</div>',
            '<a class="waves-effect waves-teal btn-flat right" v-bind:style="{display: disp};" onclick="vm.viewPostById({{post_id}})">Read more</a>',
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
        isLoading: false
    },
    created: function () {
        this.init();
    },
    methods: {
        init: function() {
            var url = window.location.pathname;

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

            if (!append) {
                this.currentPage = 0;
            }

            if (!category_id) {
                url = "/api/post/all?page=" + this.currentPage;
            }
            else {
                url = "/api/post/byCategoryId?page=" + this.currentPage + '&category_id=' + category_id;
            }

            AJAX({
                url: url,
                type: 'GET',
                before: function() {
                    if (!append) {
                        if (category_id || !vm && !vm.isPopState) {
                            changeURL('post/category=' + category_id);
                        }
                        //fadeOut(byClass('main')[0], 10);
                    }
                },
                done: function (data) {
                    res = JSON.parse(data);
                    if (!append) {
                        fadeIn(byClass('main')[0], 300);
                        vm.post = res.table;
                        vm.maxPage = res.max_pages;
                    }
                    else {
                        vm.isLoading = false;
                        vm.post = vm.post.concat(res.table);
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
                before: function() {
                    changeURL('post/id=' + id);
                    fadeOut(byClass('main')[0], 10);
                },
                done: function (data) {
                    fadeIn(byClass('main')[0], 300);
                    vm.post = JSON.parse(data);
                }
            });
        }, // viewPostById
        more: function() {
            if (vm.currentPage + 1 == vm.maxPage || window.location.pathname[6] == 'i')
                return;

            vm.isLoading = true;
            vm.currentPage++;
            vm.getPostByCategory(vm.currentCategoryId, true);
        }, // more
        reset: function () {
            changeURL('');
            this.init();
        }
    }
});

window.onscroll = function() {
    if(!vm.isLoading 
        && document.documentElement.scrollHeight - window.innerHeight > 0 
        && window.scrollY >= document.documentElement.scrollHeight - window.innerHeight * 2) {
        vm.more();
    }
};

function changeURL(url, noAnime){
    scrollTopStack.push(window.scrollY);
    window.history.pushState({}, 0, '//' + window.location.host + '/' + url);
    //$("html, body").animate({ scrollTop: 0 }, "fast");
    scrollTo(0);
}

function animate(time, start, end, io, callback) {
	var id;
    id = setInterval(frame, 5);
	io(start);
	setTimeout(function (){
		clearInterval(id);
		io(end);
		if (callback)
			callback();
	}, time);
    function frame() {
        var current = io();
        io((end - start) / (time / 5) + current * 1);
    }
}

function byId(name) {
    return document.getElementById(name);
}

function byClass(name) {
    return document.getElementsByClassName(name);
}

function fadeOut(element, duration, callback) {
    function fadeIO(arg) {
        if (arg == null) return element.style.opacity * 1;
        else element.style.opacity = arg + '';
    }
    animate(duration, 1, 0, fadeIO, callback);
}

function fadeIn(element, duration, callback) {
    function fadeIO(arg) {
        if (arg == null) return element.style.opacity * 1;
        else element.style.opacity = arg + '';
    }
    animate(duration, 0, 1, fadeIO, callback);
}

function scrollTo(position, callback) {
    var body = document.getElementsByTagName('body')[0];
    var scrollTop = body.scrollTop;
    function scrollIO(arg) {
        if (arg == null) return body.scrollTop;
        else body.scrollTop = arg;
    }
    animate(200, scrollTop, position, scrollIO, callback);
}

window.onpopstate = function(e) {
    e.preventDefault();
    var posts = byClass('main')[0];
    fadeOut(posts, 100, function() {
        vm.isPopState = true;
        vm.init();
        vm.isPopState = false;
        //$("html, body").animate({ scrollTop: scrollTopStack.pop() }, "fast");
        //scrollTo(scrollTopStack.pop());
    });
};