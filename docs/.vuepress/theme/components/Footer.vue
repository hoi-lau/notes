<template>
  <div class="footer-wrapper">
    <span>
      <!-- <i class="iconfont reco-theme"></i> -->
      <a target="blank" href="https://www.vuepress.cn/">powered by vuepress.</a>
    </span>
    <span v-if="$themeConfig.record">
      <i class="iconfont reco-beian"></i>
      <a :href="$themeConfig.recordLink || '#'">{{ $themeConfig.record }}</a>
    </span>
    <span>
      <i class="iconfont reco-copyright"></i>
      <a>
        <span>© {{ $themeConfig.author }}</span>
        &nbsp;&nbsp;
        <span>{{ $themeConfig.startYear }} - </span>
        {{ new Date().getFullYear() }}
      </a>
    </span>
    <span v-show="showAccessNumber">
      <i class="iconfont reco-eye"></i>
      <AccessNumber idVal="/" />
    </span>
  </div>
</template>

<script>
import AccessNumber from './comments/AccessNumber'
export default {
  components: {
    AccessNumber
  },
  computed: {
    showAccessNumber () {
      const {
        $themeConfig: { valineConfig },
        $themeLocaleConfig: { valineConfig: valineLocalConfig }
      } = this

      const vc = valineLocalConfig || valineConfig
      if (vc && vc.visitor != false) {
        return true
      }
      return false
    }
  }
}
</script>

<style lang="stylus" scoped>
  .footer-wrapper {
    padding: 1.5rem 2.5rem;
    border-top: 1px solid var(--border-color);
    text-align: center;
    color: lighten($textColor, 25%);
    a {
      font-size 14px
    }
    > span {
      margin-left 2rem
      > i {
        margin-right .5rem
      }
    }
    .cyber-security {
      img {
        margin-right .5rem
        width 20px
        height 20px
        vertical-align middle
      }
      a {
        vertical-align middle
      }
    }
  }

@media (max-width: $MQMobile) {
  .footer {
    text-align: left!important;
    > span {
      display block
      margin-left 0
      line-height 2rem
    }
  }
}
</style>
