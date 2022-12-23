	<script setup>
	import { ref, reactive, computed, onMounted } from 'vue'
	import { deck } from '../stores/deck'
	import { player } from '../stores/player'
	import { dealer } from '../stores/dealer'
	import { gameSequence } from '../stores/gameSequence'
	import Card from '../sub/Card.vue'
	import Results from '../sub/Results.vue'
	import PlayerActions from '../sub/PlayerActions.vue'

	const gameResult = ref('');

	const handScores = computed(() => {
		return {
			player: getHandScore(player.hand),
			dealer: getHandScore(dealer.hand)
		}

		function getHandScore(hand){
			if(hand.length < 2) return null;

			// value of the hand where ace is just == 1
			const baseScore = hand.reduce((a,b) =>  a + getCardValue(b), 0);
			// amount of aces in the hand. 
			const aceCount = hand.filter((card) => card.value == 'ACE').length;

			if(aceCount > 0){
				// potential values of the hand with all the ace values.
				const potentialHands = [];

				// Values increment by 10 for each ace in the hand
				for(let i = 0; i <= aceCount; i++){
					potentialHands.push(baseScore + (i * 10))
				}
				
				//filter scores > 21
				const playableHands = potentialHands.filter(score => score <= 21)
				//if all scores are > 21, best score becomes 22(BUST); else find the highest score
				const bestHand = playableHands.length > 0 ? playableHands.reduce((a,b) => Math.max(a,b)) : 22;

				// return the best hand (resolved)
				return resolveHand(bestHand)
			}

			return resolveHand(baseScore)

			function resolveHand(handScore){
				if(handScore > 21) return 'BUST';
				else if(handScore == 21) return 'BLACK JACK';
				return handScore
			}

			function getCardValue(card){
				if(['JACK', 'QUEEN', 'KING'].find(royal => card.value == royal)) return 10;
				else if(card.value == 'ACE') return 1;
				else return Number(card.value);
			}
		}
	})

	function dealPhase(){
		gameSequence.current = 'deal';
		
		deck.draw(4, (response) => {
			const [ a, b, c, d] = response.cards;

			wait(0, () => dealer.addCard(a, true))
			.then(() => wait(300, () => player.addCard(b)))
			.then(() => wait(300, () => dealer.addCard(c)))
			.then(() => wait(300, () => player.addCard(d)))
			.finally(() => wait(500, () => checkResult((value) => endPhase(value), playPhase)))
		})
	}

	function endPhase(result){
		gameSequence.current = 'end';
		gameResult.value = result;
	}

	function playPhase(){
		gameSequence.current = 'play';
	}

	function newGame(){
		player.reset();
		dealer.reset();
		gameResult.value = '';
		wait(500, dealPhase);
	}

	function checkResult(resolve, reject){
		if(isNaN(handScores.value.player)) resolve(handScores.value.player);
		else reject()
	}

	function wait(ms, callback){
		return new Promise(resolve => {
			setTimeout(() => {
				callback();
				resolve();
			}, ms)
		})
	}

	onMounted(() => deck.newDeck().then(dealPhase))
	
	</script>

	<template>
		<div id="game">
			<div id="dealer-hand-container" class="hand-container">
				<TransitionGroup name="card" id="dealer-hand" class="hand" tag="ul">
					<Card 
					v-for="card in dealer.hand" 
					:card="card"
					:key="card.code"
					/>
				</TransitionGroup>
				<span 
					id="dealer-score" 
					class="score" 
					v-if="gameSequence.current == 'reveal' || gameSequence.current == 'end'">
					{{ handScores.player }}
				</span>
			</div>

			<div 
				id="player-hand-container"
				ref="playerRef" 
				:class="['hand-container',{
					'card-zoom': gameSequence.current == 'play'
				}]">
				<TransitionGroup name="card" id="player-hand" class="hand" tag="ul">
					<Card 
					v-for="card in player.hand" 
					:card="card"
					:key="card.code"
					/>
				</TransitionGroup>
				<span id="player-score" class="score" v-if="gameSequence.current != 'deal'">{{ handScores.player }}</span>
			</div>

			<div id="player-wager">
				<img 
				src="/images/chip-green.png" 
				class="chip" 
				v-for="wager in player.wager" 
				:key="wager"
				/>
			</div>

			<PlayerActions
				:class="{active : gameSequence.current == 'play'}"
				@check-result="checkResult((value) => endPhase(value), playPhase)"
				:wait="wait"
			/>

			<Results 
				:game-result="gameResult"
				@new-game="newGame()"
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
			position: relative;

			h3{
				color: white;
			}
			
			.hand{
				@include flex($gap: 0.25em);

				&#dealer-hand{
					font-size: 0.9rem;
				}
			}

			&#player-hand-container{
				&.card-zoom{
					transform: scale(1.2);
				}
			}

			.score{
					position: absolute;
					border: 2px solid black;
					@include flex($align:center, $justify: center);
					font-size: 1.5rem;
					width: 3rem;
					height: 3rem;
					border-radius: 3rem;
					right: -1.5rem;
					top: -1.5rem;
					background: white;
				}
		}

		#player-wager{
			@include flex($justify: center, $gap: 1rem);
			font-size: 2rem;
			.chip{
				height: 2.5em;
			}
		}


	}

	</style>
