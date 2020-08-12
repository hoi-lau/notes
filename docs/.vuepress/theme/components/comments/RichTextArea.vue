<template>
  <div class="text-area">
    <textarea v-model="value" spellcheck autocomplete="on" maxlength="2048" placeholder="支持markdown" rows="10" class="rich-text"></textarea>
    <div @click="selectEmoji($event)">
      <span v-for="(item, index) in emojiList" :key="index" class="emoji">{{ item }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: '',
      emojiList: ['😀', '😁', '😂', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '😗', '😚', '😙', '😇', '😐', '😑', '😶', '😏', '😣', '😥', '😮', '😯', '😪', '😫', '😴', '😌', '😛', '😜', '😝', '😒', '😓', '😔', '😕', '😲', '😷', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😬', '😰', '😱', '😳', '😵', '😡', '😠', '😭', '😢', '😔', '😱', '😌', '💛', '🙂', '😒', '😜', '👍︎', '👏', '💪', '👌', '❤️', '💕']
    }
  },
  methods: {
    selectEmoji(e) {}
  }
}
</script>

<style scoped lang='stylus'>
.text-area
  position relative
  border 1px solid #eee
  border-radius 4px
.rich-text 
  width 100%
  box-sizing border-box
  padding .5rem
  resize none
  border none 
  outline none

.emoji
  margin 0 0.2rem 0.2rem 0.2rem
  font-size 1.3rem 
  cursor pointer
  &:hover
    outline auto
</style>