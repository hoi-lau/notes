<template>
  <Common>
    <component v-if="$frontmatter.home" :is="homeCom"/>
    <Page v-else :sidebar-items="sidebarItems"/>
    <Footer v-if="$frontmatter.home" class="footer" />
  </Common>
</template>

<script>
import Home from '../components/Home'
import HomeBlog from '../components/HomeBlog'
import Page from '../components/Page'
import Footer from '../components/Footer'
import Common from '../components/Common'
import { resolveSidebarItems } from '../helpers/utils'

export default {
  components: { HomeBlog, Home, Page, Common, Footer },

  computed: {
    sidebarItems () {
      return resolveSidebarItems(
        this.$page,
        this.$page.regularPath,
        this.$site,
        this.$localePath
      )
    },
    homeCom () {
      const { type } = this.$themeConfig
      if (type !== undefined) {
        return type == 'blog' ? 'HomeBlog' : type
      }
      return 'Home'
    }
  },
  beforeMount() {
  }
}
</script>

<style src="prismjs/themes/prism-tomorrow.css"></style>
<style src="../styles/index.styl" lang="stylus"></style>
