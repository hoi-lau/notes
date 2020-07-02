<template>
  <main class="page" @click="copyCode($event)">
    <ModuleTransition>
      <div v-show="recoShowModule && $page.title" class="page-title">
        <h1>{{$page.title}}</h1>
        <hr>
        <PageInfo :pageInfo="$page" :showAccessNumber="showAccessNumber"></PageInfo>
      </div>
    </ModuleTransition>

    <ModuleTransition delay="0.08">
      <Content v-show="recoShowModule" class="theme-reco-content"/>
    </ModuleTransition>

    <ModuleTransition delay="0.16">
      <footer v-show="recoShowModule" class="page-edit">
        <div
          class="edit-link"
          v-if="editLink"
        >
          <a
            :href="editLink"
            target="_blank"
            rel="noopener noreferrer"
          >{{ editLinkText }}</a>
          <OutboundLink/>
        </div>

        <div
          class="last-updated"
          v-if="lastUpdated"
        >
          <span class="prefix">{{ lastUpdatedText }}: </span>
          <span class="time">{{ lastUpdated }}</span>
        </div>
      </footer>
    </ModuleTransition>

    <ModuleTransition delay="0.24">
      <div class="page-nav" v-if="recoShowModule && (prev || next)">
        <p class="inner">
          <span
            v-if="prev"
            class="prev"
          >
            ←
            <router-link
              v-if="prev"
              class="prev"
              :to="prev.path"
            >
              {{ prev.title || prev.path }}
            </router-link>
          </span>

          <span
            v-if="next"
            class="next"
          >
            <router-link
              v-if="next"
              :to="next.path"
            >
              {{ next.title || next.path }}
            </router-link>
            →
          </span>
        </p>
      </div>
    </ModuleTransition>
    <ModuleTransition delay="0.32">
      <Comments v-if="recoShowModule" :isShowComments="shouldShowComments"/>
    </ModuleTransition>
  </main>
</template>

<script>
import PageInfo from './PageInfo'
import { resolvePage, outboundRE, endingSlashRE } from '../util'
import ModuleTransition from './ModuleTransition'
import moduleTransitonMixin from '../mixins/moduleTransiton'
import Comments from './comments/Comments'
import posts from '../mixins/posts'
export default {
  mixins: [moduleTransitonMixin, posts],
  components: { PageInfo, ModuleTransition, Comments},

  props: ['sidebarItems'],

  data () {
    return {
      isHasKey: true,
      zIndex: 1000,
      exsitCount: 0
    }
  },

  computed: {
    // 是否显示评论
    shouldShowComments () {
      const { isShowComments } = this.$frontmatter
      const { showComment } = this.$themeConfig.valineConfig || { showComment: true }
      return (showComment !== false && isShowComments !== false) || (showComment === false && isShowComments === true)
    },
    showAccessNumber () {
      const {
        $themeConfig: { valineConfig },
        $themeLocaleConfig: { valineConfig: valineLocalConfig }
      } = this

      const vc = valineLocalConfig || valineConfig
      if (vc && vc.visitor != false) {
        return true
      }
      return false
    },
    lastUpdated () {
      return this.$page.lastUpdated
    },
    lastUpdatedText () {
      if (typeof this.$themeLocaleConfig.lastUpdated === 'string') {
        return this.$themeLocaleConfig.lastUpdated
      }
      if (typeof this.$themeConfig.lastUpdated === 'string') {
        return this.$themeConfig.lastUpdated
      }
      return 'Last Updated'
    },
    prev () {
      const prev = this.$frontmatter.prev
      if (prev === false) {
        return
      } else if (prev) {
        return resolvePage(this.$myPosts, prev, this.$route.path)
      } else {
        return resolvePrev(this.$page, this.sidebarItems)
      }
    },
    next () {
      const next = this.$frontmatter.next
      if (next === false) {
        return
      } else if (next) {
        return resolvePage(this.$myPosts, next, this.$route.path)
      } else {
        return resolveNext(this.$page, this.sidebarItems)
      }
    },
    editLink () {
      if (this.$frontmatter.editLink === false) {
        return false
      }
      const {
        repo,
        editLinks,
        docsDir = '',
        docsBranch = 'master',
        docsRepo = repo
      } = this.$themeConfig

      if (docsRepo && editLinks && this.$page.relativePath) {
        return this.createEditLink(repo, docsRepo, docsDir, docsBranch, this.$page.relativePath)
      }
      return ''
    },
    editLinkText () {
      return (
        this.$themeLocaleConfig.editLinkText || this.$themeConfig.editLinkText || `Edit this page`
      )
    }
  },

  mounted() {
    this.$nextTick(() => {
      if (navigator.clipboard) {
        const preList = Array.from(document.querySelectorAll('div[class*="language-"] pre'))
        try {
          preList.forEach((el, index) => {
            const span = document.createElement('span')
            span.classList.add('copy')
            span.textContent = 'copy'
            span.title = 'copy code to clipboard'
            span.dataset['index'] = index
            el.parentNode.appendChild(span)
          })
        } catch (error) {
        }
      }
    })
  },

  methods: {
    createEditLink (repo, docsRepo, docsDir, docsBranch, path) {
      const bitbucket = /bitbucket.org/
      if (bitbucket.test(repo)) {
        const base = outboundRE.test(docsRepo)
          ? docsRepo
          : repo
        return (
          base.replace(endingSlashRE, '') +
           `/src` +
           `/${docsBranch}/` +
           (docsDir ? docsDir.replace(endingSlashRE, '') + '/' : '') +
           path +
           `?mode=edit&spa=0&at=${docsBranch}&fileviewer=file-view-default`
        )
      }

      const base = outboundRE.test(docsRepo)
        ? docsRepo
        : `https://github.com/${docsRepo}`
      return (
        base.replace(endingSlashRE, '') +
        `/edit` +
        `/${docsBranch}/` +
        (docsDir ? docsDir.replace(endingSlashRE, '') + '/' : '') +
        path
      )
    },
    copyCode(e) {
      if (e.srcElement.textContent === 'copy' && e.srcElement.parentNode.classList.contains('line-numbers-mode')) {
        const index = e.srcElement.dataset.index
        if (document.queryCommandSupported('copy')) {
          window.getSelection().removeAllRanges();
          const range = document.createRange()
          range.selectNode(e.srcElement.parentNode.firstChild)
          window.getSelection().addRange(range)
          try {
            const successful = document.execCommand('copy')
            successful ? this.showMessage('copy success!', 'success') : this.showMessage('copy failed!', 'warn')
          } catch(err) {
            console.log(err)
          }
          window.getSelection().removeAllRanges();
        } else if (navigator.clipboard) {
          const promise = navigator.clipboard.writeText(e.srcElement.parentNode.firstChild.textContent)
          promise.then(res => {
            this.showMessage('copy success!', 'success')
          }).catch(error => {
            this.showMessage('copy failed!', 'warn')
          })
        }
      }
    },
    showMessage(text = 'success', type = 'success') {
      const map = {
        success: 'icon-chenggong',
        warn: 'icon-jinggao-copy'
      }
      const node = document.createElement('div')
      node.style.cssText = `z-index: ${this.zIndex};top: ${(this.exsitCount + 1) * 64}px`
      node.classList.add('el-message')
      node.classList.add(`el-message-${type}`)
      node.innerHTML = `<i class="iconfont ${map[type]} message-status"></i><p style="margin: 0">${text}</p>`
      document.body.appendChild(node)
      this.exsitCount++
      const timer = setTimeout(() => {
        document.body.removeChild(node)
        this.exsitCount--
        clearTimeout(timer)
      }, 2200)
    }
  }
}

function resolvePrev (page, items) {
  return find(page, items, -1)
}

function resolveNext (page, items) {
  return find(page, items, 1)
}

function find (page, items, offset) {
  const res = []
  flatten(items, res)
  for (let i = 0; i < res.length; i++) {
    const cur = res[i]
    if (cur.type === 'page' && cur.path === decodeURIComponent(page.path)) {
      return res[i + offset]
    }
  }
}

function flatten (items, res) {
  for (let i = 0, l = items.length; i < l; i++) {
    if (items[i].type === 'group') {
      flatten(items[i].children || [], res)
    } else {
      res.push(items[i])
    }
  }
}

</script>

<style lang="stylus">
@require '../styles/wrapper.styl'
.el-message
  min-width: 380px;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  position: fixed;
  left: 50%;
  top: 4rem;
  background-color: #edf2fc;
  overflow: hidden;
  padding: 15px 15px 15px 20px;
  display: flex;
  align-items: center;
  animation:mymove 2.5s 1;
  -moz-animation:mymove 2.5s 1; /* Firefox */
  -webkit-animation:mymove 2.5s 1; /* Safari and Chrome */
  -o-animation:mymove 2.5s 1; 

@keyframes mymove {
  0% {
    opacity: 0;
    transform:translateY(-40px);
  }
  20% {
    opacity: 1;
    transform:translateY(0);
  }
  80% {
    opacity: 1;
    transform:translateY(0);
  }
  100% {
    opacity: 0;
    transform:translateY(-64px);
  }
}
.icon-chenggong
  color #67c23a;
.el-message-warn
  background-color: #fdf6ec;
  border-color: #faecd8;

.el-message-success
  background-color: #f0f9eb;
  border-color: #e1f3d8;

.message-status
  margin-right: 1rem

div[class*="language-"] .copy
  position: absolute
  z-index: 3
  top: 0.8em
  right: 1em
  font-size: 0.75rem
  cursor pointer
  color: #fff

.page
  padding-top 5rem
  padding-bottom 2rem
  display block
  .page-title
    max-width: $contentWidth;
    margin: 0 auto;
    padding: 1rem 2.5rem;
    color var(--text-color)
  .page-edit
    @extend $wrapper
    padding-top 1rem
    padding-bottom 1rem
    overflow auto
    .edit-link
      display inline-block
      a
        color $accentColor
        margin-right 0.25rem
    .last-updated
      float right
      font-size 0.9em
      .prefix
        font-weight 500
        color $accentColor
      .time
        font-weight 400
        color #aaa
  .comments-wrapper
    @extend $wrapper

.page-nav
  @extend $wrapper
  padding-top 1rem
  padding-bottom 0
  .inner
    min-height 2rem
    margin-top 0
    border-top 1px solid var(--border-color)
    padding-top 1rem
    overflow auto // clear float
  .next
    float right

@media (max-width: $MQMobile)
  .page-title
    padding: 0 1rem;
  .page-edit
    .edit-link
      margin-bottom .5rem
    .last-updated
      font-size .8em
      float none
      text-align left

</style>
