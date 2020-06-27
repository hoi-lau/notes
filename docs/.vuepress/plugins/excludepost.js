// 排除未发布的post
// mixins
const path = require('path')
module.exports = (options, ctx) => {
  return {
    async ready() {
      for (let i = 0; i < ctx.pages.length; i++) {
        const frontMatter = ctx.pages[i].frontmatter
        if (frontMatter.publish === false) {
          ctx.pages.splice(i, 1)
          i--
        }
      }
      // ...
    },
    updated() {
    },
    async generated (pagePaths) {
    },
    clientRootMixin: path.resolve(__dirname, '../theme/mixins/posts.js')
  }
}
