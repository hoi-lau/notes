<template>
  <ModuleTransition>
    <div class="text-area">
      <textarea
        v-model="form.comment"
        spellcheck
        autocomplete="on"
        maxlength="2048"
        placeholder="支持markdown"
        rows="10"
        class="rich-text"
      ></textarea>
      <div @click="selectEmoji($event)">
        <span
          v-for="(item, index) in emojiList"
          :key="index"
          :data-index="index"
          class="emoji"
          >{{ item }}</span
        >
      </div>
      <div class="input-wrapper">
        <input v-model="form.nickname" placeholder="昵称" maxlength="16" class="primary-input" />
        <input v-model="form.email" placeholder="邮箱" maxlength="64" class="primary-input" />
        <input v-model="form.website" placeholder="你的网址" maxlength="64" class="primary-input" />
      </div>
      <div class="align-right btn-wrapper">
        <button class="primary-btn preview" @click="parsePlain()">预览</button>
        <button class="primary-btn submit" @click="submit()">{{ submitText }}</button>
      </div>
      <ModuleTransition>
        <div class="preview-container" v-show="showPreview" v-html="parseResult"></div>
      </ModuleTransition>
    </div>
  </ModuleTransition>
</template>

<script>
import ModuleTransition from '../ModuleTransition'
import Marked from 'marked'
import http from '../../util/api'
import GlobalBus from '../store'
export default {
  components: {ModuleTransition},
  props: {
    submitText: {
      type: String,
      default: () => '提交'
    }
  },
  data() {
    return {
      parseResult: '',
      form: {
        nickname: '',
        email: '',
        website: '',
        comment: ''
      },
      showPreview: false,
      emojiList: [
        '😀',
        '😁',
        '😂',
        '😃',
        '😄',
        '😅',
        '😆',
        '😉',
        '😊',
        '😋',
        '😎',
        '😍',
        '😘',
        '😗',
        '😚',
        '😙',
        '😇',
        '😐',
        '😑',
        '😶',
        '😏',
        '😣',
        '😥',
        '😮',
        '😯',
        '😪',
        '😫',
        '😴',
        '😌',
        '😛',
        '😜',
        '😝',
        '😒',
        '😓',
        '😔',
        '😕',
        '😲',
        '😷',
        '😖',
        '😞',
        '😟',
        '😤',
        '😢',
        '😭',
        '😦',
        '😧',
        '😨',
        '😬',
        '😰',
        '😱',
        '😳',
        '😵',
        '😡',
        '😠',
        '😭',
        '😢',
        '😔',
        '😱',
        '😌',
        '💛',
        '🙂',
        '😒',
        '😜',
        '👍︎',
        '👏',
        '💪',
        '👌',
        '❤️',
        '💕'
      ]
    }
  },
  watch: {
    'form.comment': function(latest, old) {
      if (this.showPreview) this.parseResult = Marked(this.form.comment)
    }
  },
  methods: {
    selectEmoji(e) {
      const index = e.srcElement.dataset['index']
      if (index) {
        this.form.comment += this.emojiList[index]
      }
    },
    parsePlain() {
      if (this.form.comment === '') return
      this.parseResult = Marked(this.form.comment)
      this.showPreview = !this.showPreview
    },
    submit() {
      if (!this.form.comment) return
      const form = Object.assign({}, this.form)
      form.path = location.pathname
      form.nickname = this.form.nickname || 'Anonymous'
      http({
        url: 'comment',
        method: 'post',
        data: JSON.stringify(form)
      }).then(res => {
        if (res.code === 0) {
          GlobalBus.publish('reFetchComment')
        }
      }).catch(error => {console.log(error)})
    }
  }
}
</script>

<style scoped lang="stylus">
.text-area
  position relative
  border 1px solid #eee
  border-radius 4px
  padding 0.15rem
.rich-text
  width 100%
  box-sizing border-box
  padding .5rem
  resize none
  border none
  outline none

.emoji
  padding 0 0.2rem
  font-size 1.3rem
  cursor pointer
  &:hover
    outline auto

.input-wrapper
  padding 1rem
  input 
    border-bottom 1px solid #eee
    width 30%

.primary-input
  border none
  outline none
  height 2rem

@media screen and (max-width: 540px){
  .input-wrapper>input{
    width: 100%
  }
  button.preview {
    margin-left: 0
  }
}
.align-right
  text-align right

.primary-btn
  cursor pointer
  display: inline-block
  line-height 1
  white-space nowrap
  background #fff
  border 1px solid #dcdfe6
  color #606266
  text-align center
  box-sizing border-box
  outline none
  margin 0
  transition .1s
  font-weight 500
  user-select none
  padding 12px 20px
  border-radius 4px
  &:hover
    color #409eff
    border-color #c6e2ff
    background-color #ecf5ff
  &:active
    color #3a8ee6
    border-color #3a8ee6
    outline none

.btn-wrapper
  padding: 0.5rem 1rem 0.5rem 1rem;

.submit, .preview
  margin-left: 1.5rem
.preview-container
  padding 0.5rem
</style>
