---
title: 「css」SVG动画
date: 2021-08-13
hideSidebar: true
categories:
 - css
tags:
 - animation
publish: false
---

::: demo 简介
```html
<template>
  <svg
    className="svg-success"
    baseProfile="full"
    width="20"
    height="20"
    xmlns="http://www.w3.org/2000/svg">
    <circle
      className="circle"
      cx="10"
      cy="10"
      r="9"
      fill="none"
      stroke="#09bb07"
      strokeWidth="1"
    />
    <polyline
      className="tick"
      points="5 10, 9 14, 15 7"
      fill="none"
      stroke="#09bb07"
      strokeWidth="2"
    />
  </svg>
  <button>btn</button>
</template>
<style>
.svg-success {
  .circle {
    stroke-dasharray: 1 60;
    stroke-linecap: round;
    transform: rotate(-90deg) translateX(-20px);
    animation: circle-round 1s ease-in-out;
    animation-fill-mode: forwards;
  }
  .tick {
    stroke-dasharray: 0 45;
    stroke-dashoffset: 1;
    stroke-linecap: round;
    stroke-linejoin: round;
    animation: tick-round 1s ease-in-out;
    animation-fill-mode: forwards;
    animation-delay: .95s;
  }
}
</style>
```
:::