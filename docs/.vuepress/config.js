const conf = process.env.NODE_ENV === 'development' ? require('./dev.themeConfig.js') : require('./prod.themeConfig')
// console.log(conf)
module.exports = {
  base: '/',
  title: 'im.liukai',
  description: 'personal blog',
  head: [
    ['link', { rel: 'icon', href: conf.faviconIco }]
  ],
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
    startYear: '2018',
    sidebar: 'auto',
    logo: conf.faviconIco,
    bgImg: conf.bgImg,
    nav: [
      {text: 'Home', link: '/', icon: 'icon-home_n'},
      {text: 'Category', link: '/category/', icon: 'icon-icon-goodscategory'},
      {text: 'Tags', link: '/tag/', icon: 'icon-tag'},
      // {text: 'Timeline', link: '/timeline/', icon: 'icon-shijian'},
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