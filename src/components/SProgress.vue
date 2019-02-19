<template>
  <svg class="s-progress" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="gray1" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#fcfcfc"/>
          <stop offset="100%" stop-color="#e6e6e6"/>
        </linearGradient>
        <linearGradient id="gray2" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#e6e6e6"/>
          <stop offset="100%" stop-color="#d0d0d0"/>
        </linearGradient>
        <linearGradient id="gray3" gradientUnits="objectBoundingBox" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#d0d0d0"/>
          <stop offset="100%" stop-color="#bababa"/>
        </linearGradient>
        <linearGradient id="gray4" gradientUnits="objectBoundingBox" x1="1" y1="1" x2="0" y2="0">
          <stop offset="0%" stop-color="#bababa"/>
          <stop offset="100%" stop-color="#a4a4a4"/>
        </linearGradient>
        <linearGradient id="gray5" gradientUnits="objectBoundingBox" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stop-color="#a4a4a4"/>
          <stop offset="100%" stop-color="#8e8e8e"/>
        </linearGradient>
        <linearGradient id="gray6" gradientUnits="objectBoundingBox" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stop-color="#8e8e8e"/>
          <stop offset="100%" stop-color="#787878"/>
        </linearGradient>
      </defs>

      <g fill="none" stroke-width="2" transform="translate(12,12)">
        <path d="M 0,-10 A 10,10 0 0,1 8.66,-5" stroke="url(#gray1)"/>
        <path d="M 8.66,-5 A 10,10 0 0,1 8.66,5" stroke="url(#gray2)"/>
        <path d="M 8.66,5 A 10,10 0 0,1 0,10" stroke="url(#gray3)"/>
        <path d="M 0,10 A 10,10 0 0,1 -8.66,5" stroke="url(#gray4)"/>
        <path d="M -8.66,5 A 10,10 0 0,1 -8.66,-5" stroke="url(#gray5)"/>
        <path d="M -8.66,-5 A 10,10 0 0,1 0,-10" stroke="url(#gray6)"/>
      </g>
  </svg>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 's-progress',
});
</script>
