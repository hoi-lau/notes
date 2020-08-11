<template>
  <div class="comments-wrapper">
    <!-- this is Comments -->
    <ClientOnly>
      <RichTextArea />
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
