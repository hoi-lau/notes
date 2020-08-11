<template>
  <div class="text-area">
    <textarea v-model="value" spellcheck autocomplete="on" maxlength="2048" placeholder="支持markdown" rows="8" class="rich-text"></textarea>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: '',
      emojiList: ['😀', '😁', '😂', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '😗', '😚', '😙', '😇', '😐', '😑', '😶', '😏', '😣', '😥', '😮', '😯', '😪', '😫', '😴', '😌', '😛', '😜', '😝', '😒', '😓', '😔', '😕', '😲', '😷', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😬', '😰', '😱', '😳', '😵', '😡', '😠', '😭', '😢', '😔', '😱', '😌', '💛', '🙂', '😒', '😜', '👍︎', '👏', '💪', '👌', '❤️', '💕']
    }
  }
}
</script>

<style scoped lang='stylus'>
.rich-text 
  width 100%
  box-sizing border-box
  padding .5rem
  // border none
  // outline none
  resize none

</style>