启动：

```
  // node 版本 >= 14
  npm run dev
```

### 流程

- 从 [partners](https://partners.funpinpin.top/partners/apps/settings/5035390243342827) 创建一个 app, 测试环境暂时用 `zhangjianli@papayamobile.com` 密码： `123456`。

- apps 的 git 地址为 https://git.funpinpin.cn/apps 新建一个项目

- clone [apps-template](ssh://git@git.funpinpin.cn:2222/apps/apps-template.git) 项目，<font color="red">并修改项目的 git remote 为自己项目的 git url</font>。

- 修改项目的 .env 文件，将`FPP_API_KEY` `FPP_API_SECRET`修改为 partner 创建的项目的值， `SHOP`修改为想要测试的店铺地址。

- 安装 [ngrok](https://ngrok.com/) 或者 其他工具 或者让后端把自己的 ip 做一下外网穿透，并启动 ngrok， 把 https 域名复制到 `.env` 文件的`HOST`, 并修改 partners 本 app 项目的应用 url 为 ngrok 域名， 重定向 URL 修改为 `域名 + /auth/callback`。

- 安装 redis, 修改 `/server/session/redisStorage.js` 里的 url 为自己机器的 redis 地址，如果是测试环境，根据 [app - redis 对应关系文档](https://k5awkspuet.feishu.cn/wiki/wikcn1oK7pHYrBr7HT9ub0PFGBz#q6SQkH) 修改测试环境的 redis 数据库。

- 目前的开发方式是通过 [script_tag](https://k5awkspuet.feishu.cn/wiki/wikcnUS11z1xJLuNZEm8V4GTdoe) 的开发方式，将本地的 js 脚本推到 C 端店铺，在`/server/server.js` 的 afterAuth 方法里 调用 script_tag api。(后续因为插件的位置不固定，会支持 liquid 模式， 参考 https://github.com/Shopify/theme-extension-getting-started)
