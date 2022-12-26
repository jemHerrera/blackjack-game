<script setup>
  import { ref } from 'vue';
  import Game from './components/main/Game.vue'
  import Settings from './components/main/Settings.vue'
  import ShootingStarBackground from './components/main/ShootingStarBackground.vue';

  const showSettings = ref(false);

</script>

<template>
  <Settings :class="{ 'show': showSettings}" @close="showSettings = !showSettings"/>
  <Game  />
  <button class="button-settings" @click="showSettings = !showSettings">
    <span v-if="!showSettings" class="material-icons">settings</span>
    <span v-else class="material-icons">close</span>
  </button>
  <ShootingStarBackground/>
</template>

<style lang="scss">
  @use './styles/abstracts' as *;
  @use './styles/resets.scss';

  #blackjack{
    height: 100%;
    @include flex;
    background-color: $color-gdark0;

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
