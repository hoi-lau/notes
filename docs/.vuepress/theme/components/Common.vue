<template>
  <div
    class="theme-container"
    :class="pageClasses"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd">
      <transition name="fade">
        <LoadingPage v-show="firstLoad" class="loading-wrapper" />
      </transition>
      <!-- <transition name="fade">
        <Password v-show="!isHasKey" class="password-wrapper-out" key="out" />
      </transition> -->
      <div :class="{ 'hide': firstLoad }">
        <Navbar
        v-if="shouldShowNavbar"
        @toggle-sidebar="toggleSidebar"/>

        <div
          class="sidebar-mask"
          @click="toggleSidebar(false)"></div>

        <Sidebar
          v-if="sidebar"
          :items="sidebarItems"
          @toggle-sidebar="toggleSidebar">
          <slot
            name="sidebar-top"
            slot="top"/>
          <slot
            name="sidebar-bottom"
            slot="bottom"/>
        </Sidebar>

        <!-- <Password v-show="!isHasPageKey" :isPage="true" class="password-wrapper-in" key="in"></Password> -->
        <div>
          <slot></slot>
        </div>
      </div>
  </div>
</template>

<script>
import { resolveSidebarItems } from '../helpers/utils'
import LoadingPage from './LoadingPage'
import posts from '../mixins/posts'
import { setTimeout } from 'timers'
import moduleTransitonMixin from '../mixins/moduleTransiton'
import http from '../util/api'
import globalData from '../util/store'

export default {
  mixins: [moduleTransitonMixin, posts],

  components: { 
    'Sidebar': () => import('./Sidebar'),
    'Navbar': () => import('./Navbar'),
    LoadingPage
  },

  props: {
    sidebar: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      isSidebarOpen: false,
      firstLoad: true
    }
  },

  computed: {

    shouldShowNavbar () {
      const { themeConfig } = this.$site
      const { frontmatter } = this.$page
      if (
        frontmatter.navbar === false ||
        themeConfig.navbar === false
      ) return false
      return (
        this.$title ||
        themeConfig.logo ||
        themeConfig.repo ||
        themeConfig.nav ||
        this.$themeLocaleConfig.nav
      )
    },

    shouldShowSidebar () {
      const { frontmatter } = this.$page
      return (
        this.sidebar !== false &&
        !frontmatter.home &&
        frontmatter.sidebar !== false &&
        this.sidebarItems.length
      )
    },

    sidebarItems () {
      return resolveSidebarItems(
        this.$page,
        this.$page.regularPath,
        this.$site,
        this.$localePath
      )
    },

    pageClasses () {
      const userPageClass = this.$frontmatter.pageClass
      return [
        {
          'no-navbar': !this.shouldShowNavbar,
          'sidebar-open': this.isSidebarOpen,
          'no-sidebar': !this.shouldShowSidebar
        },
        userPageClass
      ]
    }
  },

  mounted () {
    this.$router.afterEach(() => {
      this.isSidebarOpen = false
    })
    this.handleLoading()
    this.fetchData()
  },

  methods: {
    fetchData() {
      if (globalData.views.length > 0) return
      http({
        url: 'records'
      }).then(res => {
        globalData.views = res.data
        window.postMessage('initDone', location.origin)
      }).catch(error => {  
      })
    },

    toggleSidebar (to) {
      this.isSidebarOpen = typeof to === 'boolean' ? to : !this.isSidebarOpen
    },

    // side swipe
    onTouchStart (e) {
      this.touchStart = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      }
    },

    onTouchEnd (e) {
      const dx = e.changedTouches[0].clientX - this.touchStart.x
      const dy = e.changedTouches[0].clientY - this.touchStart.y
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0 && this.touchStart.x <= 80) {
          this.toggleSidebar(true)
        } else {
          this.toggleSidebar(false)
        }
      }
    },

    handleLoading () {
      const time = this.$frontmatter.home && sessionStorage.getItem('firstLoad') == undefined ? 1000 : 0
      setTimeout(() => {
        this.firstLoad = false
        if (sessionStorage.getItem('firstLoad') == undefined) sessionStorage.setItem('firstLoad', false)
      }, time)
    }
  },

}
</script>

<style lang="stylus" scoped>
.theme-container
  .loading-wrapper
    position absolute
    z-index 22
    top 0
    bottom 0
    left 0
    right 0
    margin auto
  .hide
    height 100vh
    overflow hidden

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
