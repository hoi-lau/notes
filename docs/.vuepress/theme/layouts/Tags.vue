<template>
  <Common  class="tags-wrapper">
    <!-- 标签集合 -->
    <ModuleTransition>
      <TagList
        v-show="showModule"
        :currentTag="currentTag"
        @getCurrentTag="tagClick"></TagList>
    </ModuleTransition>

    <!-- 博客列表 -->
    <ModuleTransition delay="0.08">
      <note-abstract
        v-show="showModule"
        class="list"
        :data="filterPosts"
        :currentPage="currentPage"
        :currentTag="currentTag"
        @currentTag="getCurrentTag"></note-abstract>
    </ModuleTransition>

    <!-- 分页 -->
    <ModuleTransition delay="0.16">
      <Pagination
        class="pagation"
        :total="filterPosts.length"
        :currentPage="currentPage"
        @getCurrentPage="getCurrentPage"></Pagination>
    </ModuleTransition>
  </Common>
</template>

<script>
import Common from '../components/Common'
import TagList from '../components/TagList'
import NoteAbstract from '../components/NoteAbstract'
import Pagination from '../components/Pagetion'
import posts from '../mixins/posts'
import pagination from '../mixins/pagination'
import ModuleTransition from '../components/ModuleTransition'
import moduleTransitonMixin from '../mixins/moduleTransiton'

export default {
  mixins: [moduleTransitonMixin, pagination, posts],
  components: { Common, NoteAbstract, TagList, ModuleTransition, Pagination },
  data () {
    return {
      tags: [],
      currentTag: '全部',
      currentPage: 1,
      allTagName: '全部',
      filterPosts: []
    }
  },

  beforeMount () {
    if (this.$tags.list.length > 0) {
      if (this.$route.query.tag && this.$route.query.tag !== this.currentTag) {
        this.currentTag = this.$route.query.tag
        this.$myPosts.forEach(item => {
          if (item.frontmatter.tags.includes(this.currentTag)) {
            this.filterPosts.push(item)
          }
        })
      } else {
        this.filterPosts = Array.from(this.$myPosts)
      }
    }
  },

  mounted () {
    this._setPage(this._getStoragePage())
  },

  methods: {

    tagClick (tagInfo) {
      this.currentTag = tagInfo.name
      // 每次点击tag重置为第一页
      this.currentPage = 1
      if (this.$route.path !== tagInfo.path) {
        while (this.filterPosts.length > 0) {
          this.filterPosts.splice(0, 1)
        }
        if (this.currentTag === '全部') {
          this.$myPosts.forEach(item => {
            this.filterPosts.push(item)
          })
        } else {
          this.$myPosts.forEach(item => {
            if (item.frontmatter.tags.includes(this.currentTag)) {
              this.filterPosts.push(item)
            }
          })
        }
      }
      if (this.$route.path !== tagInfo.path) {
        this.$router.push({ path: tagInfo.path })
      }
    },

    getCurrentTag (tag) {
      this.$emit('currentTag', tag)
    },

    getCurrentPage (page) {
      this._setPage(page)
      setTimeout(() => {
        window.scrollTo(0, 0)
      }, 100)
    },
    _setPage (page) {
      this.currentPage = page
      this.$page.currentPage = page
      this._setStoragePage(page)
    }
  }
}
</script>

<style src="prismjs/themes/prism-tomorrow.css"></style>
<style lang="stylus" scoped>
.tags-wrapper
  max-width: $contentWidth
  margin: 0 auto;
  padding: 4.6rem 2.5rem 0;

@media (max-width: $MQMobile)
  .tags-wrapper
    padding: 5rem 0.6rem 0;
</style>
