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
      {text: 'home', link: '/', icon: ''},
      {text: 'category', link: '/categories/', icon: ''},
      {text: 'tags', link: '/tag/', icon: ''},
      {text: 'timeline', link: '/timeline/', icon: ''},
      {text: 'contact', icon: '', children: [{
        text: '',
        link: '',
        icon: ''
      }, {
        text: '',
        link: '',
        icon: ''
      }]}
    ]
  }
}