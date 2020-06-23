module.exports = (options, ctx) => {
  return {
    async ready() {
      console.log('------')
      ctx.pages.forEach(item => {
        console.log(item)
      })
      console.log(ctx.pages.length)
      // ...
    },
    updated() {
      console.log('------')
      ctx.pages.forEach(item => {
        console.log(item)
      })
      console.log(ctx.pages.length)
    },
    async generated (pagePaths) {
      console.log('------')
      ctx.pages.forEach(item => {
        console.log(item)
      })
      console.log(ctx.pages.length)
      // ...
    }
  }
}
