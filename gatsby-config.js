const path = require('path');

module.exports = {
  plugins: [
    {
      resolve: `gatsby-theme-notes`,
      options: {
        mdx: false,
        basePath: `/notes`,
      },
    },
    // with gatsby-plugin-theme-ui, the last theme in the config
    // will override the theme-ui context from other themes
    { resolve: `gatsby-theme-blog` },
    {
      resolve: 'gatsby-plugin-tajs',
      options: {
        sid: process.env.TAJS_SID
      }
    }
  ],
  siteMetadata: {
    title: `小橙时光机`,
    author: 'pansinm',
    description: '千里之行始于足下',
    social: []
  }
}
console.log(process.env);
