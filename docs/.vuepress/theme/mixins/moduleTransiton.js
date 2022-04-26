export default {
  data () {
    return {
      showModule: false
    }
  },
  mounted () {
    this.showModule = true
  },
  destroyed () {
    this.showModule = false
  }
}
