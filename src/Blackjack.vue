<script setup>
  import Game from './components/main/Game.vue'
  import Settings from './components/main/Settings.vue'
</script>

<template>
  <Settings />
  <Game  />
</template>

<style lang="scss">
  @use './styles/abstracts' as *;
  @use './styles/resets.scss';

  #blackjack{
    height: 100vh;
    width: 100vw;
    background-color: $color-gscale1;
  }

</style>
