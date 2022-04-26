<template>
  <div class="footer-wrapper">
    <!-- <span>
      <a target="_blank" href="https://www.vuepress.cn/">powered by vuepress.</a>
    </span> -->
    <span>
      <a>
        <span>© {{ $themeConfig.author }}</span>
        &nbsp;&nbsp;
        <span>{{ $themeConfig.startYear }} - </span>
        {{ new Date().getFullYear() }}
      </a>
    </span>
    <span>
      <a :href="'mailto:' + $themeConfig.email">{{ $themeConfig.email }}</a>
    </span>
    <span>
      thanks: <a href="https://www.recoluan.com/" target="_blank">recoluan</a>
    </span>
    <span
      v-show="showViewNumber"
      class="pointer"
      :title="'浏览量:' + viewNumber"
    >
      <a>
        <i class="iconfont icon-eye" style="color: #3eaf7c;"></i>
        <span>{{ viewNumber }}</span>
      </a>
    </span>
    <p>
      <a href="https://beian.miit.gov.cn/" target="_blank"
        >鄂ICP备2022002249号-1</a
      >
    </p>
  </div>
</template>

<script>
import globalData from '../util/store'
import { numberFormat } from '../util/index'
export default {
  data() {
    return {
      showViewNumber: false,
      viewNumber: 0
    }
  },
  mounted() {
    window.addEventListener(
      'message',
      e => {
        if (e.data === 'initDone') {
          this.showViewNumber = true
          const index = globalData.views.findIndex(item => item.path === '/')
          this.viewNumber = numberFormat(globalData.views[index].totalViews)
        }
      },
      false
    )
  }
}
</script>

<style lang="stylus" scoped>
  .pointer
    cursor pointer

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
