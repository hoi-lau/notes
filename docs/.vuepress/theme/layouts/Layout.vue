<template>
  <Common :sidebar="!$frontmatter.home">
    <HomeBlog v-if="$frontmatter.home"/>
    <Page v-else :sidebar-items="sidebarItems"/>
    <Footer v-if="$frontmatter.home" class="footer" />
  </Common>
</template>

<script>
// import Home from '../components/Home'
import HomeBlog from '../components/HomeBlog'
import Footer from '../components/Footer'
import Common from '../components/Common'
import { resolveSidebarItems } from '../helpers/utils'

export default {
  components: { HomeBlog, 'Page': () => import('../components/Page'), Common, Footer },

  computed: {
    sidebarItems () {
      return resolveSidebarItems(
        this.$page,
        this.$page.regularPath,
        this.$site,
        this.$localePath
      )
    }
  }
}
</script>

<style src="prismjs/themes/prism-tomorrow.css"></style>
<style src="../styles/index.styl" lang="stylus"></style>
