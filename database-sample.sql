DROP DATABASE IF EXISTS blog;

CREATE DATABASE blog;
use blog;

CREATE TABLE common (
  blog_title VARCHAR(50),
  blog_subtitle VARCHAR(50)
);

INSERT INTO common VALUES('namespace ntzyz;',  '这里什么都没有，真的。');

CREATE TABLE category(
    category_id BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    category_name VARCHAR(100)
);

INSERT INTO category(category.category_name) VALUES
("笔记"), ("计算机"), ("计算器"), ("杂类"), ("坑");

CREATE TABLE widget(
    widget_id BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    widget_content TEXT,
    widget_isEnabled INT NOT NULL DEFAULT 1
);

INSERT INTO widget(widget_content) VALUES(
    '<div style="font-size: 1.2em; margin-bottom: 8px;">Links</div>\n'
    '<div style="border-bottom: solid 1px black; margin-bottom: 2px; padding-bottom: 2px;">\n'
    '	<a href="https://www.ntzyz.cn/" target="_blank">About me</a><br />\n'
    '	<a href="https://blog.dimension.moe/minecraft/" target="_blank">Minecraft</a><br />\n'
    '</div>\n'
    '<div>\n'
    '	<a title="JerryFu\'s Blog" href="http://www.jerryfu.net/" target="_black">JerryFu\'s Blog</a><br />\n'
    '	<a title="Enrichment Center" href="http://tonoko.zz.mu/" target="_blank">Enrichment Center</a><br />\n'
    '	<a title="春上冰月的博客" href="http://haruue.moe/" target="_blank">春上冰月的博客</a><br />\n'
    '	<del><a title="Uiharu\'s Garden — 初春静流的花园" href="http://uiharu.sinaapp.com" target="_blank">Uiharu\'s Garden</a></del><br />\n'
    '	<a title=">Lithia\'s Core" href="http://lithcore.cn/" target="_blank">&gt;Lithia\'s Core</a><br />\n'
    '	<a title="ZephRay" href="http://zephray.com/" target="_blank">ZephRay</a><br />\n'
    '	<a title="kasora\'s blog" href="https://blog.kasora.moe/" target="_blank">kasora\'s blog</a><br />\n'
    '	<a title="Test2g" href="https://www.test2g.xyz/" target="_blank">Test2g</a><br />\n'
    '	<a title="苍崎橙子" href="http://ao.acg.ac/" target="_blank">苍崎橙子</a><br />\n'
    '	<a title="R-C\'s Blog" href="http://blog.r-c.im/" target="_blank">RiCE Blog</a><br />\n'
    '	<a title="Shell Bin" href="http://shellbin.top/" target="_blank">Shell Bin</a>\n'
    '</div>\n'
);

CREATE TABLE user(
    user_id BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    user_name VARCHAR(200) NOT NULL,
    user_pass VARCHAR(200) NOT NULL
);
INSERT INTO user(user_name, user_pass) VALUES (
    'ntzyz', '24aa57a0b8614a5fb6bb7dae52695dbf'
);

/* render_type:
 *     0 -> HTML
 *     1 -> Jade(pug)
 *     2 -> Markdown
 */
CREATE TABLE post(
    post_id BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    post_title TEXT,
    post_content TEXT,
    post_date VARCHAR(20),
    post_category_id BIGINT,
    post_shot TEXT,
    render_type INT DEFAULT 0
);

INSERT INTO post(post_title, post_content, post_date, post_category_id) VALUES
(
    "[Node.js] 学校网关登陆脚本",
    '<style type="text/css">\n'
    '.indent {text-indent: 2em;margin-top: 0.75em; margin-bottom: 0.75em;}\n'
    '</style>\n'
    '<p class="indent">虽然现在我在的学校很辣鸡，但是偶然间发现所有的教学区设备，在通过网关认证后，就可以获得一个江苏省常州市教育网的公网 IP 地址，同时拥有 10Mbps 的上下对等带宽，还是蛮良心的（</p>\n'
    '<p class="indent">然后我们就在某办公室内放置了一个配置极其破烂的台式机，用来转发内网端口，VPN 远程接入和其他奇奇怪怪的服务。然而所有这些的前提就是通过了网关认证。比较尴尬的是那台电脑并没有显示器，所以我们只能想其他办法实现这一步骤。</p>\n'
    '<p class="indent">最初我们使用了 VPN ——搭建一个 PPTP VPN 服务器并配置好 NAT 和 IP Forward，然后在内网使用 PPTP 连接至服务器，打开浏览器访问任意非 SSL 网站，就会被 Redirect 到网关认证，然后浏览器里操作就可以完成了。</p>\n'
    '<p class="indent">后来发现 PPTP 的配置实在是比较繁琐（虽然比较其他形式的 VPN，PPTP 是搭建最快速的一个），同时存在各种各样的问题导致 PPP 认证不通过，进而无法建立 PPTP 连接，我们开始改用 Shadowsocks，在需要认证的机器上搭建一个 ss-server，在内网的其他机器上配置好 Shadowsocks 客户端，就可以和 PPTP 一样进行操作了。</p>\n'
    '<p class="indent">再后来发现 Shadowsocks 的编译还是要准备一堆依赖，配置也不足够简单。反思 PPTP，我们使用 PPTP 的目的就是将两个机器组成一个虚拟专用网络，然后所有流量从待认证机器出去以实现认证。仔细想想不难发现其实我们用来认证的机器和待认证机器本来就在一个网段了，为什么还要专门组一个呢？（智商-10）所以我们只需要在待认证服务器上执行这句 iptables 语句：</p>\n'
    '<code>iptables -t nat -A POSTROUTING -s 219.230.153.0/24 -j MASQUERADE</code>\n'
    '<p class="indent">然后再另一个设备上，将默认网关调整至待认证设备IP，就可以和之前一样操作并通过认证了。</p>\n'
    '<p class="indent">今天在数据结构上机的时候，突然想到，我们进行网关的认证，其实就是在网页上填写一个表单，并提交这个表单到认证服务器，随后就解锁了国际互联网访问。那为什么要搞的这么复杂绕了一大圈就为了进行一个 POST 呢？（智商+10）</p>\n'
    '<p class="indent">想到这些就随后几分钟写了段 JavaScript，来实现这些个操作，实测可行。代码如下：</p>\n'
    '<code lang="javascript">\n'
    'var request = require(\'request\');\n'
    'request = request.defaults({jar: true});\n'
    '\n'
    '// Your login info here.\n'
    'var uname = \'\';\n'
    'var passwd = \'\';\n'
    '\n'
    'request.get(\'http://www.bilibili.com/\', (err, res, body) => {\n'
    '    var loginURL = body.substr(28, body.length - 38);\n'
    '    request.get(loginURL, (err, res, body) => {\n'
    '        request.post({\n'
    '            url: \'http://219.230.159.25/eportal/webgateuser.do?method=login_ajax_pure_internet&param=true&\' + loginURL.substr(40) + \'&username=\' + uname + \'&pwd=\' + passwd,\n'
    '            form: {\n'
    '                is_auto_land: false,\n'
    '                usernameHidden: uname,\n'
    '                username_tip: \'Username\',\n'
    '                username: uname,\n'
    '                strTypeAu:null,\n'
    '                uuidQrCode:null,\n'
    '                authorMode:null,\n'
    '                pwd_tip: \'Password\',\n'
    '                pwd: passwd\n'
    '            },\n'
    '            referer: loginURL,\n'
    '            headers: {\n'
    '                \'user-agent\': \'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36\',\n'
    '                \'Connection\': \'keep-alive\',\n'
    '                \'accept\': \'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8\',\n'
    '                \'Accept-Encoding\': \'gzip, deflate\',\n'
    '                \'Accept-Language\': \'zh,zh-CN;q=0.8,en-US;q=0.6,en;q=0.4\'\n'
    '            }\n'
    '        }, (err, res, body) => {\n'
    '            if (res.caseless.dict[\'auth-result\'] == \'success\') {\n'
    '                console.log(\'Login Success.\');\n'
    '            }\n'
    '            else {\n'
    '                console.log(\'Something happened.\');\n'
    '            }\n'
    '        });\n'
    '    })\n'
    '})\n'
    '</code>\n'
    '<p class="indent">这段代码需要一个叫 `request` 的依赖，直接输入 `npm insall request` 即可完成安装。将个人的登录信息修改好后，执行脚本：`node login.js`，如果看到输出`Login Success.`，就表明认证通过，可以开始上网啦（（</p>\n'
    '<p class="indent"><del datetime="2016-06-05T04:00:49+00:00">现在看来当时的解决方案真是智障（不）</del></p>\n',
    '160605',
    '2'
),(
    "[ndless] ndless 4.0 环境搭建",
    '<p style="text-indent:2em;">机缘巧合之下，手里又多了个 Ti nspire CX CAS，系统版本为 3.1.0392，还是相当新的一台计算器。</p>\n'
    '<p style="text-indent:2em;">说起来，自从高中毕业后，就没怎么折腾过计算器了。毕竟手机和电脑基本都是随时可用，再加上计算器的弱性能和繁琐的操作，逐渐的也就失去了兴趣。但是当这个计算器刚刚到手的时候，又不由得想搞着玩玩了（</p>\n'
    '<p style="text-indent:2em;">ndless 和 nspire 的关系就不必再述了，具体可以前往 cncalc.org 上查找相关置顶贴，或者直接前往 ndless 的官网了解详情。</p>\n'
    '<p style="text-indent:2em;">我的系统是 Ubuntu 15.10，其他发行版自行调整部分内容～首先是准备一下依赖：</p>\n'
    '<code>\n'
    'sudo apt-get install git build-essential binutils libgmp-dev libmpfr-dev libmpc-dev libssl-dev libpython2.7-dev libboost-program-options-dev\n'
    '</code>\n'
    '<p style="text-indent:2em;">如果编译过程中还出现了依赖相关的错误，缺啥装啥就是了（</p>\n'
    '<p style="text-indent:2em;">再然后是下载源码：</p>\n'
    '<code>\n'
    'git clone --recursive https://github.com/ndless-nspire/Ndless.git\n'
    '</code>\n'
    '<p style="text-indent:2em;">完成之后，就可以开始编译 toolchain 了：</p>\n'
    '<code>\n'
    'cd Ndless/ndless-sdk/toolchain/\n'
    './build_toolchain.sh\n'
    '</code>\n'
    '<p style="text-indent:2em;">编译时间比较长，而且这个过程还蜜汁烧 U，之前还试图在 Cubieboard 4 CC-A80 上搭建环境的，结果负载飚到 32 然后彻底 GG 了（</p>\n'
    '<p style="text-indent:2em;">完成之后，还要再编译 ndless 4.0：</p>\n'
    '<code>\n'
    'cd ../..\n'
    'make -j4\n'
    '</code>\n'
    '<p style="text-indent:2em;">这次的快多了，很快就生成了相关文件。到此为止就顺利地完成了环境的搭建。下面就用 ndless sdk 自带的一个 sample 来测试测试：</p>\n'
    '<code>\n'
    'cd Ndless/ndless-sdk/samples/freetype/\n'
    'make clean\n'
    'make\n'
    '</code>\n'
    '<p style="text-indent:2em;">完成之后，就可以将目录下的 freetype_demo.tns 发送到计算器中，然后直接执行。如果没有什么意外，你会看到一个倾斜的 Droid Sans 字样。</p>\n'
    '\n'
    '<p style="text-indent:2em;">顺便 nNovel Freetype 项目开坑，来补偿当年的各种遗憾。权且当作自娱自乐吧（</p>\n',
    '160507',
    '3'
),(
    "恶意满满的世界，你好！",
    "<p>手贱啊手贱，备份好了的数据库没有下载到本地就rebuild了……<br><del>打死我也不用CentOS了，还是Ubuntu好</del><br>罢了罢了，重新再来呗</p>",
    '150726',
    '4'
),(
    '[重要！]简单说明',
	'<p>这是一个半成品 Blog，后台使用了 Node.js 和 Express.js，前台目前使用了 Vue.js, Materialize。</p>\n',
    '160729',
    '5'
);

INSERT INTO post(post_title, post_content, post_date, post_category_id, render_type) VALUES
(
    'Jade 渲染测试',
    'style.\n'
    '    h1.myclass { color: #080;}\n'
    '    p.indent {text-indent: 2em;}\n'
	'h1.myclass 标题1\n'
    'h2 标题2\n'
    'p.indent 正文\n'
    'code(lang="cpp").\n'
    '    #include <iostream>\n'
    '    \n'
    '    int main(void) {\n'
    '        std::cout << "Hello World" << std::endl;\n'
    '        return 0;\n'
    '    }\n'
    'p.indent Jade 讲道理还是蛮好用的，不过改名 pug 了就感觉不萌了呢（（\n',
    '160802',
    '5',
    1
);

INSERT INTO post(post_title, post_content, post_date, post_category_id, render_type) VALUES
(
    'MD 渲染测试',
    '# 模拟POS\n'
    '\n'
    '某自选商店需要定购一种POS终端，这个终端使用LED向顾客显示应付金额，已收金额和找零金额。顾客购买商品后，由收银员统计应付金额，并通过你的程序向顾客显示应付款。顾客给足付款后，收银员计算出找零并同时通过你的程序显示已收金额和找零金额。当然顾客也可能因为最后应付金额过大而取消购买，这样就在屏幕上显示CANCEL字样。由于商店规模不是很大，假定顾客购买的所有商品均在999元以内。因此实际一次显示金额最宽不超过7个字符(￥XXX.XX)。\n'
    '\n'
    '你的程序需要实现以下功能：\n'
    '\n'
    '1. POS开机：第一次使用POS机，需要事先清除当日已收款\n'
    '2. 统计应付金额：收银员输入应付金额，在屏幕上用7×8点阵显示应付金额\n'
    '3. 收款找零：收银员输入顾客付款，在屏幕上分两行显示已收款和找零款\n'
    '4. 取消付款：收银员取消本次购买。\n'
    '5. 日结算：收银员统计当日销售额。\n'
    '\n'
    '```\n'
    '@Override\n'
    'protected void onCreate(Bundle savedInstanceState) {\n'
    '    super.onCreate(savedInstanceState);\n'
    '    setContentView(R.layout.activity_main);\n'
    '\n'
    '    DBox.init(this, "Test.db");\n'
    '}\n'
    '```\n',
    '160802',
    '5',
    2
);