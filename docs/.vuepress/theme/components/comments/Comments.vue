<template>
  <div
    class="comments-wrapper"
    v-show="isShowComments">
    <!-- this is Comments -->
    <!-- <ClientOnly>
      <component
        :is="componentName"
        :options="options" />
    </ClientOnly> -->
  </div>
</template>

<script>
export default {
  props: {
    isShowComments: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
  }
}
</script>
