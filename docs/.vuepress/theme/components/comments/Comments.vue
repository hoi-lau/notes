<template>
  <div class="comments-wrapper">
    <!-- this is Comments -->
    <ClientOnly>
      <div class="opinion">我要发表看法</div>
      <RichTextArea />
      <!-- render comment list -->
    </ClientOnly>
  </div>
</template>

<script>
import RichTextArea from './RichTextArea'
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
  }
}
</script>
<style lang="stylus" scoped>
.opinion
  font-size 1.2rem
  padding 0.2rem 0 1rem 0.5rem
  letter-spacing 0.1rem
</style>