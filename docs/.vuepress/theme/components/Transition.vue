<template>
  <!-- js钩子 -->
  <transition
    name="fade"
    @before-enter="setStyle"
    @enter-cancelled="setStyle"
    @enter="setStyle"
    @after-enter="unsetStyle"
    @before-leave="setStyle"
    @leave="setStyle"
    @leave-cancelled="setStyle">
    <!-- 插槽 -->
    <slot />
  </transition>
</template>

<script>
// 过渡组件
export default {
  methods: {
    setStyle(el) {

    },
    beforeEnter(el) {},
    enterCancelled(el) {},
    enter(el, callback) {
      callback()
    },
    afterEnter(el) {},
    beforeLeave(el, callback) {
      callback()
    },
    leave(el) {},
    afterLeave(el) {},
    // leaveCancelled 只用于 v-show 中
    leaveCancelled(el) {}
  }
}
</script>

<style>

</style>