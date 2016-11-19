'use strict';

let hljs = require('highlight.js');
let pug = require('pug');
let marked = require('marked');
let utils = require('../utils');

let decodeHTML = (str) => {
    var strMap = {
        '&lt': '<',
        '&gt': '>',
        '&quot': '"',
        '&apos': '\'',
        '&amp': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&apos;': '\'',
        '&amp;': '&'
    };
    if (str.length === 0) {
        return '';
    }
    return str.replace(/&[0-9a-zA-Z]+;?/g, function(s) {
        return strMap[s] || s;
    });
}

let render = (table, part, more) => {
    for (let i = 0; i != table.length; ++i) {
        if (table[i].render_type == 1) {
            table[i][part] = pug.render(table[i][part]);
        } else if (table[i].render_type == 2) {
            table[i][part] = decodeHTML(marked(table[i][part]));
        }

        if (more && table[i][part].indexOf('<!-- more -->') >= 0) {
            table[i][part] = table[i][part].substr(0, table[i][part].indexOf('<!-- more -->')) 
        }

        table[i][part] = table[i][part].replace(/<code lang="(.+?)">([^]+?)<\/code>/g, (match, p1, p2) => {
            if (table[i].render_type != 2)
                return '<pre>' + hljs.highlight(p1, p2).value + '</pre>';
            else 
                return hljs.highlight(p1, p2).value;
        }).replace(/<code>([^]+?)<\/code>/g, function(match, p1) {
            if (table[i].render_type != 2)
                return '<pre>' + hljs.highlightAuto(p1).value + '</pre>';
            else
                return hljs.highlightAuto(p1).value;
        });
    }
    return table;
}

module.exports = render;