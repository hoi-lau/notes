<template>
  <div class="home-blog">
    <div class="hero" :style="{ ...bgImageStyle }">
      <div
        class="mask"
        :style="{
      background: `url(${$frontmatter.bgImage ? $withBase($frontmatter.bgImage) : 'https://s1.ax1x.com/2020/07/05/USrh1P.jpg'}) center/cover no-repeat`}"></div>
      <ModuleTransition>
        <img
          v-if="showModule && $frontmatter.heroImage"
          :style="heroImageStyle || {}"
          :src="$withBase($frontmatter.heroImage)"
          alt="hero">
      </ModuleTransition>
      <ModuleTransition delay="0.04">
        <h1 v-if="showModule && $frontmatter.heroText !== null">
          {{ $frontmatter.heroText || $title }}
        </h1>
      </ModuleTransition>

      <!-- <ModuleTransition delay="0.08">
        <p v-if="showModule && $frontmatter.tagline !== null" class="description">
          {{ $frontmatter.tagline || $description }}
        </p>
      </ModuleTransition> -->
    </div>

    <ModuleTransition delay="0.16">
      <div v-show="showModule" class="home-blog-wrapper">
        <div class="blog-list">
          <!-- 博客列表 -->
          <note-abstract
            :data="$myPosts"
            :currentPage="currentPage"></note-abstract>
          <!-- 分页 -->
          <Pagetion
            class="pagation"
            :total="$myPosts.length"
            :currentPage="currentPage"
            @getCurrentPage="getCurrentPage" />
        </div>
        <div class="info-wrapper">
          <PersonalInfo/>
          <h4><i class="iconfont reco-category"></i> category </h4>
          <ul class="category-wrapper">
            <li class="category-item" v-for="(item, index) in categoryList" :key="index">
              <router-link :to="item.path">
                <span class="category-name">{{ item.name }}</span>
                <span class="post-num" :style="{ 'backgroundColor': getOneColor() }">{{ item.pages.length }}</span>
              </router-link>
            </li>
          </ul>
          <hr>
          <h4 v-if="$tags.list.length !== 0"><i class="iconfont reco-tag"></i> tag </h4>
          <TagList @getCurrentTag="getPagesByTags" />
          <!-- <h4 v-if="$themeConfig.friendLink && $themeConfig.friendLink.length !== 0"><i class="iconfont reco-friend"></i> {{homeBlogCfg.friendLink}}</h4> -->
          <!-- <FriendLink /> -->
        </div>
      </div>
    </ModuleTransition>

    <ModuleTransition delay="0.24">
      <Content v-show="showModule && !$page.frontmatter" class="home-center" custom/>
    </ModuleTransition>
  </div>
</template>

<script>
import TagList from './TagList'
// import FriendLink from './FriendLink'
import NoteAbstract from './NoteAbstract'
import pagination from '../mixins/pagination'
import posts from '../mixins/posts'
import Pagetion from './Pagetion'
import ModuleTransition from './ModuleTransition'
import PersonalInfo from './PersonalInfo'
import { getOneColor } from '../helpers/other'
import moduleTransitonMixin from '../mixins/moduleTransiton'
export default {
  mixins: [pagination, moduleTransitonMixin, posts],
  // FriendLink
  components: { NoteAbstract, TagList, ModuleTransition, PersonalInfo, Pagetion },
  data () {
    return {
      recoShow: false,
      currentPage: 1,
      tags: [],
      categoryList: []
    }
  },
  computed: {
    homeBlogCfg () {
      return this.$recoLocales.homeBlog
    },
    actionLink () {
      const {
        actionLink: link,
        actionText: text
      } = this.$frontmatter

      return {
        link,
        text
      }
    },
    heroImageStyle () {
      return this.$frontmatter.heroImageStyle || {
        maxHeight: '200px',
        margin: '6rem auto 1.5rem'
      }
    },
    bgImageStyle () {
      const initBgImageStyle = {
        height: '350px',
        textAlign: 'center',
        overflow: 'hidden'
      }
      const {
        bgImageStyle
      } = this.$frontmatter

      return bgImageStyle ? { ...initBgImageStyle, ...bgImageStyle } : initBgImageStyle
    },
    heroHeight () {
      return document.querySelector('.hero').clientHeight
    }
  },
  mounted () {
    this.recoShow = true
    this._setPage(this._getStoragePage())
    // 浅拷贝
    this.categoryList = Array.from(this.$categories.list)
    this.categoryList.sort((before, after) => {
      if (before.pages.length > after.pages.length) {
        return -1
      }
      return 1
    })

  },
  methods: {
    // 获取当前页码
    getCurrentPage (page) {
      this._setPage(page)
      setTimeout(() => {
        window.scrollTo(0, this.heroHeight)
      }, 100)
    },
    // 根据分类获取页面数据
    getPages () {
      let pages = this.$myPosts
      pages = pages.filter(item => {
        const { home, date } = item.frontmatter
        return !(home == true || date === undefined)
      })
      // reverse()是为了按时间最近排序排序
      this.pages = pages.length == 0 ? [] : pages
    },
    getPagesByTags (tagInfo) {
      this.$router.push({ path: tagInfo.path, query: { tag: tagInfo.name } })
    },
    _setPage (page) {
      this.currentPage = page
      this.$page.currentPage = page
      this._setStoragePage(page)
    },
    getOneColor
  }
}
</script>

<style lang="stylus">
.home-blog {
  padding: $navbarHeight 0 0;
  margin: 0px auto;

  .hero {
    position relative
    display flex
    justify-content center
    flex-direction column
    .mask {
      position absolute
      top 0
      bottom 0
      left 0
      right 0
      z-index -1
      &:after {
        display block
        content ' '
        background var(--mask-color)
        position absolute
        top 0
        bottom 0
        left 0
        right 0
        z-index 0
        opacity .2
      }
    }
    figure {
      position absolute
      background yellow
    }

    h1 {
      font-size: 2.5rem;
    }

    h1, .description, .action, .huawei {
      color #fff
    }

    .description {
      margin 0
      font-size: 1.6rem;
      line-height: 1.3;
    }
  }
  .home-blog-wrapper {
    display flex
    align-items: flex-start;
    margin 20px auto 0
    max-width 1126px
    .blog-list {
      flex auto
      width 0
      .abstract-wrapper {
        .abstract-item:last-child {
          margin-bottom: 0px;
        }
      }
    }
    .info-wrapper {
      position: -webkit-sticky;
      position: sticky;
      top: 70px;
      transition all .3s
      margin-left 15px;
      flex 0 0 300px
      height auto;
      box-shadow var(--box-shadow);
      border-radius $borderRadius
      box-sizing border-box
      padding 0 15px
      background var(--background-color)
      &:hover {
        box-shadow: var(--box-shadow-hover);
      }
      h4 {
        color var(--text-color)
      }
      .category-wrapper {
        list-style none
        padding-left 0
        .category-item {
          margin-bottom .4rem
          padding: .4rem .8rem;
          transition: all .5s
          border-radius $borderRadius
          box-shadow var(--box-shadow)
          background-color var(--background-color)
          &:hover {
            transform scale(1.04)
          }
          a {
            display flex
            justify-content: space-between
            .post-num {
              width 1.6rem;
              height 1.6rem
              text-align center
              line-height 1.6rem
              border-radius $borderRadius
              background #eee
              font-size .6rem
              color #fff
            }
          }
        }
      }
    }
  }
}

@media (max-width: $MQMobile) {
  .home-blog {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    .hero {
      margin 0 -1.5rem
      height 250px!important
      img {
        max-height: 210px;
        margin: 2rem auto 1.2rem;
      }

      h1 {
        font-size: 2rem;
      }

      .description {
        font-size: 1.2rem;
      }

      .action-button {
        font-size: 1rem;
        padding: 0.6rem 1.2rem;
      }
    }
    .home-blog-wrapper {
      .info-wrapper {
        display none!important
      }
    }
  }
}

@media (max-width: $MQMobileNarrow) {
  .home-blog {
    padding-left: 1.5rem;
    padding-right: 1.5rem;

    .hero {
      margin 0 -1.5rem
      height 150px!important
      img {
        max-height: 210px;
        margin: 2rem auto 1.2rem;
      }

      h1 {
        font-size: 2rem;
      }

      .description {
        font-size: 1.2rem;
      }

      .action-button {
        font-size: 1rem;
        padding: 0.6rem 1.2rem;
      }
    }

    .home-blog-wrapper {
      .info-wrapper {
        display none!important
      }
    }
  }
}
</style>
