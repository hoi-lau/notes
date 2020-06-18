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
  themeConfig: {
    nav: [
      {text: 'home', link: '/'},
      {text: 'category', link: '/'},
      {text: 'tag', link: '/'},
      {text: 'timeline', link: '/'},
      
    ]
  }
}