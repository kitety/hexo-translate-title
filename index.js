"use strict";

var hexo = hexo || {};
var config = hexo.config;
var util = require("./lib/util.js");

hexo.extend.filter.register(
  "before_post_render",
  async function (data) {
    if (!config.translate_title || !config.url) {
      console.log("config.translate_title==>", config.translate_title);
      console.log("config.url==>", config.url);
      return data;
    }
    if (!(!data.translate_title || config.rewrite)) {
      return data;
    }
    let translate_way = config.translate_title.translate_way;
    /**
     * actions 判断是不是github actions之类的发布操作，那些环境不需要代理，不然的话还是需要代理的
     * 看是否是开发环境 开发环境的话还是需要代理的
     */
    if (translate_way == "google") {
      let is_need_proxy =
        !config.translate_title.actions ||
        hexo.env.debug ||
        config.translate_title.is_need_proxy;
      let proxy_url = config.translate_title.proxy_url;
      let return_data = await util.google_translation(
        data,
        "zh-CN",
        "en",
        is_need_proxy,
        proxy_url
      );
    } else if (translate_way == "youdao") {
      let youdao_api_key = config.translate_title.youdao_api_key;
      let youdao_keyfrom = config.translate_title.youdao_keyfrom;
      let return_data = await util.youdao_translation(
        data,
        youdao_api_key,
        youdao_keyfrom
      );
    } else if (translate_way == "baidu_with_appid") {
      let return_data = await util.baidu_translation_with_appid(
        data,
        "zh",
        "en",
        config.translate_title.baidu_appid,
        config.translate_title.baidu_appkey
      );
    } else if (translate_way == "baidu_no_appid") {
      let return_data = await util.baidu_translation_no_appid(data, "zh", "en");
    }
  },
  5
);
