<script setup>
  import { ref, onMounted } from 'vue';
  import Game from './components/main/Game.vue'
  import Settings from './components/main/Settings.vue'
  import ShootingStarBackground from './components/main/ShootingStarBackground.vue';

  const settingsToggle = ref(false);

  function setup(){
    let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    
    if(width > 1200){
      settingsToggle.value = true;
    }
  }

  onMounted(setup);

</script>

<template>
  <transition name="settings">
    <Settings 
      @close="settingsToggle = false"
      v-show="settingsToggle"
    />
  </transition>
  <Game  />
  <button class="button-settings" @click="settingsToggle = !settingsToggle">
    <span v-if="!settingsToggle" class="material-icons">settings</span>
    <span v-else class="material-icons">close</span>
  </button>
  <ShootingStarBackground/>
</template>

<style lang="scss">
  @use './styles/abstracts' as *;
  @use './styles/resets.scss';

  #blackjack{
    height: 100vh;
    width: 100vw;
    @include flex;

    .button-settings{
      position: fixed;
      background: none;
      top: 1rem;
      left: 1rem;
      font-size: 3rem;
      z-index: 3;

      span{
        font-size: 1em;
        color: $color-glight3;
      }

      @include mdpi-up{
        display: none;
      }
    }
    
  }
</style>
