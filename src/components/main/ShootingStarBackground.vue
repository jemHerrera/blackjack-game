<script setup>
    import { ref } from 'vue';

    const stars = ref(7);
</script>

<template>
    <div id="shooting-star-background">
        <div class="night">
            <div v-for="star in stars" :key="star" class="shooting-star"></div>
        </div>
    </div>
</template>

<style lang="scss">
    @use '../../styles/abstracts' as *;


#shooting-star-background {
    position: fixed;
    background: radial-gradient(ellipse at bottom, $color-gdark1 0%, #050505 100%);
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  $shooting-time: 3000ms;
  
  .night {
    position: relative;
    width: 200%;
    height: 200%;
    transform: rotateZ(45deg);
  }
  
  .shooting-star {
    position: absolute;
    left: 50%;
    top: 50%;
    height: 3px;
    background: linear-gradient(-45deg, $color-main1-light, rgba(0, 0, 255, 0));
    border-radius: 999px;
    filter: drop-shadow(0 0 6px $color-main1-light);
    animation:
      tail $shooting-time ease-in-out infinite,
      shooting $shooting-time ease-in-out infinite;
    
    &::before {
      content: '';
      position: absolute;
      top: calc(50% - 1px);
      right: 0;
      height: 3px;
      background: linear-gradient(-45deg, rgba(0, 0, 255, 0), $color-main1-light, rgba(0, 0, 255, 0));
      transform: translateX(50%) rotateZ(45deg);
      border-radius: 100%;
      animation: shining $shooting-time ease-in-out infinite;
    }
  
    &::after {
      content: '';
      position: absolute;
      top: calc(50% - 1px);
      right: 0;
      height: 3px;
      background: linear-gradient(-45deg, rgba(0, 0, 255, 0), $color-main1-light, rgba(0, 0, 255, 0));
      transform: translateX(50%) rotateZ(45deg);
      border-radius: 100%;
      animation: shining $shooting-time ease-in-out infinite;
      transform: translateX(50%) rotateZ(-45deg);
    }
    
    @for $i from 1 through 7 {
      &:nth-child(#{$i}) {
        $delay: random(9999) + 0ms;
        top: calc(50% - #{random(1000) - 400px});
        left: calc(50% - #{random(600) - 200px});
        animation-delay: $delay;
        
        &::before,
        &::after {
          animation-delay: $delay;
        }
      }
    }
  }
  
  @keyframes tail {
    0% {
      width: 0;
    }
    
    30% {
      width: 100px;
    }
    
    100% {
      width: 0;
    }
  }
  
  @keyframes shining {
    0% {
      width: 0;
    }
    
    50% {
      width: 30px;
    }
    
    100% {
      width: 0;
    }
  }
  
  @keyframes shooting {
    0% {
      transform: translateX(0);
    }
    
    100% {
      transform: translateX(300px);
    }
  }
  
  @keyframes sky {
    0% {
      transform: rotate(45deg);
    }
    
    100% {
      transform: rotate(45 + 360deg);
    }
  }
</style>