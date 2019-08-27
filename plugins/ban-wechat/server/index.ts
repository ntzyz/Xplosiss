import * as pug from 'pug';
import * as path from 'path';
import * as fs from 'fs';
import * as express from 'express';

const template = `<html>
<head>
  <title>抱歉，出错了</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0">
  <link rel="stylesheet" type="text/css" href="https://res.wx.qq.com/open/libs/weui/0.4.1/weui.css">
</head>
<body>
  <div class="weui_msg">
    <div class="weui_icon_area"><i class="weui_icon_info weui_icon_msg"></i></div>
    <div class="weui_text_area">
      <h4 class="weui_msg_title">请不要在微信客户端打开链接</h4>
    </div>
  </div>
</body>
</html>`;

function installer ({ site, utils, config }) {
  site.use((req, res, next) => {
    if (/MicroMessenger/ig.test(req.headers['user-agent'])) {
      return res.send(template);
    }
    next();
  });
}

export default installer;
