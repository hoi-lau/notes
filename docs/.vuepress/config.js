module.exports = {
  base: '/',
  title: 'im.liukai',
  description: 'personal blog',
  head: [],
  port: 4000,
  dest: '.vuepress/dist',
  extraWatchFiles: [],
  markdown: {
    lineNumbers: true
  },
  plugins: [],
  themeConfig: {
    type: 'blog',
    mode: 'light',
    author: 'liukai',
    nav: [
      {text: 'Home', link: '/', icon: 'icon-home_n'},
      {text: 'Category', link: '/categories/', icon: 'icon-icon-goodscategory'},
      {text: 'Tags', link: '/tag/', icon: 'icon-tag'},
      {text: 'Timeline', link: '/timeline/', icon: 'icon-shijian'},
      {text: 'Contact', icon: 'icon-contact', items: [{
        text: 'github',
        link: 'https://github.com/imLiukai',
        icon: 'icon-git'
      }, {
        text: 'telegram',
        link: 'https://t.me/im_liukai',
        icon: 'icon-telegram'
      }]}
    ]
  }
}