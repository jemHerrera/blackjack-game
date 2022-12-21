	<script setup>
	import { ref, reactive, computed, onMounted } from 'vue'
	import { deck } from '../stores/deck'
	import { player } from '../stores/player'
	import { dealer } from '../stores/dealer'
	import { gameSequence } from '../stores/gameSequence'
	import Card from '../sub/Card.vue'
	import Results from '../sub/Results.vue'
	import PlayerActions from '../sub/PlayerActions.vue'

	const endResult = ref('');

	const handValues = computed(() => {
		return {
			player: getHandValue(player.value.hand),
			dealer: getHandValue(dealer.value.hand)
		}

		function getHandValue(hand){
			if(hand.length < 2) return null;

			const baseValue = hand.reduce((a,b) =>  a + getCardValue(b), 0);
			const aceCount = hand.filter((card) => card.value == 'ACE').length;

			if(aceCount > 0){
				// potential values of the hand with all the ace values. Values increment by 10 for each ace in the hand
				const potentialHands = [];

				for(let count = 0; count <= aceCount; count++){
					const potentialHand = baseValue + (count * 10);
					// pushes the value to potentialHands array. If value goes over 21, the hand value would become 0, meaning bust
					potentialHands.push(potentialHand > 21 ? 0 : potentialHand)
				}
				// return the best hand (resolved)
				return resolveHand(potentialHands.reduce((a,b) => Math.max(a,b)))
			}

			return resolveHand(baseValue)

			function resolveHand(handValue){
				if(handValue == 0) return 'BUST';
				else if(handValue == 21) return 'BLACK JACK';
				return handValue
			}

			function getCardValue(card){
				if(['JACK', 'QUEEN', 'KING'].find(royal => card.value == royal)) return 10;
				else if(card.value == 'ACE') return 1;
				else return Number(card.value);
			}
		}
	})

	function dealCards(){
		deck.draw(4, (response) => {
		const [ a, b, c, d] = response.cards;

			addCard(a, dealer.value.hand, true)
			.then(() => addCard(b, player.value.hand))
			.then(() => addCard(c, dealer.value.hand))
			.then(() => addCard(d, player.value.hand))
			.then(() => wait(500, () => player.value.tags.push('card-zoom')))
			.finally(() => wait(300, checkResult))
		})

		function addCard(card, hand, facedown=false){
			return wait(500, () => {
				card.facedown = facedown;
				hand.push(card);
			})
		}
	}

	function reset(){
		player.value.wager = 1;
		player.value.hand = [];
		player.value.statuses = [];
		dealer.value.hand = [];
		dealer.value.statuses = [];
		endResult.value = '';

		wait(500, dealCards);
	}

	function checkResult(){
		if(isNaN(handValues.value.player)){
			endResult.value = handValues.value.player;
		}
	}

	function resolveDealer(){
		// open first card
		// calculate if dealer's hand is less than 17
	}

	function wait(ms, callback){
		return new Promise(resolve => {
			setTimeout(() => {
				callback();
				resolve();
			}, ms)
		})
	}

	onMounted(() => deck.newDeck().then(dealCards))
	
	</script>

	<template>
		<div id="game">
			<div id="dealer-hand-container" class="hand-container">
				<TransitionGroup name="card" id="dealer-hand" class="hand" tag="ul">
					<Card 
					v-for="card in dealer.value.hand" 
					:card="card"
					:key="card.code"
					/>
				</TransitionGroup>
			</div>

			<div 
				id="player-hand-container"
				ref="playerRef" 
				:class="['hand-container',{
					'card-zoom': player.value.tags.includes('card-zoom')
				}]">
				<TransitionGroup name="card" id="player-hand" class="hand" tag="ul">
					<Card 
					v-for="card in player.value.hand" 
					:card="card"
					:key="card.code"
					/>
				</TransitionGroup>
			</div>

			<PlayerActions/>

			<Results 
				:end-result="endResult"
				@reset="reset()"
			/>
		</div>
	</template>

	<style lang="scss">
	@use '../../styles/abstracts' as *;

	#game{
		position: relative;
		z-index: 1;
		width: 100%;
		@include flex($direction:column, $align: center, $justify:space-between);
		padding: 3rem;

		.hand-container{
			transition: all 300ms ease;

			h3{
				color: white;
			}
			
			.hand{
				@include flex($gap: 0.25em);

				&#dealer-hand{
					font-size: 0.8rem;
				}
			}

			&#player-hand-container{
				&.card-zoom{
					transform: scale(1.2);
				}
			}
		}
	}

	</style>
