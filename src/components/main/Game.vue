<script setup>
  import { ref, reactive, computed } from 'vue'
  import Card from '../sub/Card.vue'

  const deck = ref({});

  const player = reactive({
    hand: [],
    status: ''
  })

  const dealer = reactive({
    hand: [],
    status: ''
  })

  function newDeck(callback){
    return new Promise((resolve) => {
      fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
        .then(response => response.json())
        .then(response => {
            deck.value = response
            resolve();
        })
        .catch(error => console.error(error));
    })
  }

  function draw(count, callback){
    fetch(`https://deckofcardsapi.com/api/deck/${deck.value.deck_id}/draw/?count=${count}`)
      .then(response => response.json())
      .then(response => {
        deck.value.count = response.remaining;
        callback(response);
      })
      .catch(error => console.error(error))
  }

  function shuffle(){
    fetch(`https://deckofcardsapi.com/api/deck/${deck.value.deck_id}/shuffle/`)
      .then(response => response.json())
      .then(response => {
        console.log('shuffled')
        deck.value = response;
      })
  }

  function initialDraw(){
    draw(4, (response) => {
      const [ a, b, c, d] = response.cards;

      function addCard(card, hand, facedown=false){
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            card.facedown = facedown;
            hand.push(card);
            resolve();
          }, 500)
        })
      }

      addCard(a, dealer.hand, true)
      .then(() => addCard(b, dealer.hand))
      .then(() => addCard(c, player.hand))
      .then(() => addCard(d, player.hand))

    })
  }

  newDeck().then(() => initialDraw());
  

</script>

<template>
  <div id="dealer-hand-container" class="hand-container">
    <h3>Dealer Hand</h3>
      <TransitionGroup name="card" id="dealer-hand" class="hand" tag="ul">
        <Card 
          v-for="card in dealer.hand" 
          :card="card"
          :key="card.code"
        />
      </TransitionGroup>
  </div>

  <div id="player-hand" class="hand-container">
    <h3>Player Hand</h3>
      <TransitionGroup name="card" id="player-hand" class="hand" tag="ul">
        <Card 
          v-for="card in player.hand" 
          :card="card"
          :key="card.code"
        />
      </TransitionGroup>
  </div>
</template>

<style lang="scss">
  @use '../../styles/abstracts' as *;

  #game{
    height: 100vh;
    width: 100vw;
    background-color: $color-gscale1;

    .hand-container{

      h3{
        color: white;
      }

      .hand{
        @include flex;
      }
    }
  }

</style>
