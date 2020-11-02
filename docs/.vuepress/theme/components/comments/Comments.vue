<template>
  <div class="comments-wrapper">
    <!-- this is Comments -->
    <ClientOnly>
      <div class="opinion">我要发表看法</div>
      <RichTextArea />
      <!-- render comment list -->
      <div>
        <template v-if="commentsData.length > 0">
          <div>{{commentsData.length}}条评论</div>
          <div v-for="item in commentsData" class="comment-item">

            <div class="comment-header">
              <div class="header-left">
                <span class="nick-name">{{item.nickname || 'anonymous'}}</span>
              </div>
              <div class="header-right">
                {{dateFormate(item.timestamp)}}
              </div>
              <div class="clear-fix" />
            </div>

            <div class="comment-body">
              <div class="comment-content" v-html="parseMarkdown(item.comment)"></div>
            </div>
          </div>
        </template>
        <template v-else>
          暂无评论
        </template>
      </div>
    </ClientOnly>
  </div>
</template>

<script>
import RichTextArea from './RichTextArea'
import Marked from 'marked'
import { date2Str } from '../../util'
export default {
  components: {
    RichTextArea
  },
  props: {
    commentsData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
    }
  },
  watch: {
    '$route': (to, from) => {

    }
  },
  methods: {
    dateFormate(date) {
      return date2Str(date)
    },
    parseMarkdown(str) {
      console.log(str)
      return Marked(str)
    }
  }
}
</script>
<style lang="stylus" scoped>
.opinion
  font-size 1.2rem
  padding 0.2rem 0 1rem 0.5rem
  letter-spacing 0.1rem

.comment-item
  padding .8rem
  overflow hidden
  word-break break-all
.comment-content
  background-color rgba(200, 200, 200,.2)
  padding 0.4rem
  &>>>p
    margin 0

.comment-header
  margin-bottom 1rem
.nick-name
  opacity 0.8

.header-left
  float left
  max-width calc(100% - 120px)

.header-right
  float right
  width 120px
@media (max-width: 400px) {
  .header-left {
    max-width 100%
  }
  .header-right {
    display none
  }
}
</style>