
#### gatsby几个重要文件

gatsby有几个非常重要的文件

- gatsby-config.js
- gatsby-browser.js
- gatsby-node.js
- gatsby-ssr.js

我们在`gatsby-config.js`中配置站点信息及相关插件，可以在`gatsby-browser.js`实现页面生命周期钩子，在`gatsby-node.js`中自定义生成页面的逻辑，在`gatsby-ssr.js`对页面渲染过程进行包装。

#### gatsby插件目录

我们可以通过插件实现[Node](https://www.gatsbyjs.org/docs/node-apis/)、[server-side rendering](https://www.gatsbyjs.org/docs/ssr-apis/)及[browser](https://www.gatsbyjs.org/docs/browser-apis/)相关接口，达到功能扩展的目的，插件目录结构如下。需要注意的是，必须包含package.json文件，否则不能正确加载。

```sh
gatsby-plugin-*
|-- gatsby-browser.js
|-- gatsby-node.js
|-- gatsby-ssr.js
`-- package.json
```

#### 插件命名规则

gatsby官方有一套插件的[命名规则](https://www.gatsbyjs.org/docs/naming-a-plugin/)

- gatsby-source-* 用于加载特定资源，如WordPress、MongoDB等；
- gatsby-transformer-* 用于数据转换，如将CSV转换成JS对象；
- gatsby-\[plugin-name\]-* 插件的插件，`gatsby-父插件名-当前插件名`，如`gatsby-remark-add-emoji`;
- gatsby-theme-* 用于[Gatsby themes](https://www.gatsbyjs.org/docs/themes/what-are-gatsby-themes/)，是gatsby主题插件;
- gatsby-plugin-* 通用命名，如果不匹配其他命名规则，就用这个。

#### 插件加载

gatsby的插件加载机制跟webpack有点相似，不过gatsby除了从node_modules目录查找插件外，还会从plugins目录中查找插件。

```js
// gatsby-config.js
module.exports = {
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `docs`,
        path: `${__dirname}/../docs/`,
      },
    },
  ],
}
```

gatsby加载完配置的插件后，还会从当前目录加载`gatsby-node.js`、`gatsby-browser.js`及`gatsby-ssr.js`。