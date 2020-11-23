<template>
  <div id="loader-wrapper">
    <!-- <div class="loader-main">
      <div v-for="item in 6" :key="`out${item}`">
      </div>
    </div> -->
    <div class="loading-main"></div>
  </div>
</template>

<style lang="stylus" scoped>
#loader-wrapper
  height:100vh;
  width:100vw;
  background #fff
  background var(--background-color)
  .loader-main::before 
    content 'loading...'
  .loader-main
    position:fixed;
    text-indent: 25px;
    color: gray;
    width:120px;
    height:50px;
    top:45%;
    left:50%;
    z-index:555;
    transform:translate(-50%,0);
    div
      &:nth-child(1){ animation:pacman-balls 1s 0s infinite linear; }
      &:nth-child(2){ animation:pacman-balls 1s 0.2s infinite linear; }
      &:nth-child(3){ animation:pacman-balls 1s 0.4s infinite linear; }
      &:nth-child(4){ animation:pacman-balls 1s 0.6s infinite linear; }
      &:nth-child(5){ animation:pacman-balls 1s 0.8s infinite linear; }
      // &:first-of-type
      //   width:0px;
      //   height:0px;
      //   display none
      //   border-right:25px solid transparent;
      //   border-top:25px solid $accentColor;
      //   border-left:25px solid $accentColor;
      //   border-bottom:25px solid $accentColor;
      //   border-radius:25px;
      //   animation:rotate_pacman_half_up 0.5s 0s infinite;
      // &:nth-child(2)
      //   width:0px;
      //   display none
      //   height:0px;
      //   border-right:25px solid transparent;
      //   border-top:25px solid $accentColor;
      //   border-left:25px solid $accentColor;
      //   border-bottom:25px solid $accentColor;
      //   border-radius:25px;
      //   animation:rotate_pacman_half_down 0.5s 0s infinite;
      //   margin-top:-50px;
      &:nth-child(1),&:nth-child(2),&:nth-child(3),&:nth-child(4),&:nth-child(5),&:nth-child(6)
        background-color:$accentColor;
        width:15px;
        height:15px;
        border-radius:100%;
        margin:2px;
        width:10px;
        height:10px;
        position:absolute;
        transform:translate(0,-6.25px);
        top:25px;
        left:100px;
      &:nth-child(6)
        display none
  @keyframes pacman-balls
    75%{opacity:0.7;}
    100%{-webkit-transform:translate(-100px,-6.25px);transform:translate(-100px,-6.25px);}
  @keyframes rotate_pacman_half_up
    0%{-webkit-transform:rotate(270deg);transform:rotate(270deg);}
    50%{-webkit-transform:rotate(360deg);transform:rotate(360deg);}
    100%{-webkit-transform:rotate(270deg);transform:rotate(270deg);}
  @keyframes rotate_pacman_half_down
    0%{-webkit-transform:rotate(90deg);transform:rotate(90deg);}
    50%{-webkit-transform:rotate(0deg);transform:rotate(0deg);}
    100%{-webkit-transform:rotate(90deg);transform:rotate(90deg);}

.loading-main
  position absolute
  top calc(50% - 1.25em)
  left calc(50% - 1.25em)
  width 2.5em
  height 2.5em
  transform rotate(165deg)
  &::before
    animation before 2s infinite
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 0.5em;
    height: 0.5em;
    border-radius: 0.25em;
    transform: translate(-50%, -50%);
  &::after
    animation: after 2s infinite;
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 0.5em;
    height: 0.5em;
    border-radius: 0.25em;
    transform: translate(-50%, -50%);

@keyframes before {
  0% {
    width: 0.5em;
    box-shadow: 1em -0.5em rgba(225, 20, 98, 0.75), -1em 0.5em rgba(111, 202, 220, 0.75);
  }
  35% {
      width: 2.5em;
      box-shadow: 0 -0.5em rgba(225, 20, 98, 0.75), 0 0.5em rgba(111, 202, 220, 0.75);
  }
  70% {
      width: 0.5em;
      box-shadow: -1em -0.5em rgba(225, 20, 98, 0.75), 1em 0.5em rgba(111, 202, 220, 0.75);
  }
  100% {
      box-shadow: 1em -0.5em rgba(225, 20, 98, 0.75), -1em 0.5em rgba(111, 202, 220, 0.75);
  }
}

@keyframes after {
  0% {
    height: 0.5em;
    box-shadow: 0.5em 1em rgba(61, 184, 143, 0.75), -0.5em -1em rgba(233, 169, 32, 0.75);
  }
  35% {
      height: 2.5em;
      box-shadow: 0.5em 0 rgba(61, 184, 143, 0.75), -0.5em 0 rgba(233, 169, 32, 0.75);
  }
  70% {
      height: 0.5em;
      box-shadow: 0.5em -1em rgba(61, 184, 143, 0.75), -0.5em 1em rgba(233, 169, 32, 0.75);
  }
  100% {
      box-shadow: 0.5em 1em rgba(61, 184, 143, 0.75), -0.5em -1em rgba(233, 169, 32, 0.75);
  }
}
</style>
