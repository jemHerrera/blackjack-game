<script setup>
import { ref, computed } from 'vue'
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
		const aceCount = hand.filter((card) => card.value == 'ACE').length;

		if(aceCount > 0){
			// potential values of the hand with all the ace values. Values increment by 10 for each ace in the hand
			const potentialHands = [];
			for(let i = 0; i <= aceCount; i++) potentialHands.push(baseScore + (i * 10))

			//filter scores > 21
			const playableHands = potentialHands.filter(score => score <= 21)
			//if all scores are > 21(bust), best score becomes lowest value from potential hands; else find the highest value from playable hands
			return playableHands.length > 0 ? playableHands.reduce((a,b) => Math.max(a,b)) : potentialHands.reduce((a,b) => Math.min(a,b));
		}

		return baseScore

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
		.finally(() => wait(500, evaluatePlayerCards))
	})
}

function revealPhase(){
	dealer.hand[0].facedown = false;
	gameSequence.current = 'reveal';
	dealerDraw();

	function dealerDraw(){
		if(handScores.value.dealer >= 17) return wait(300, evaluateDealerCards);
		wait(300, () => {
			deck.draw(1, (response) => {
				const [ card ] = response.cards;
				dealer.addCard(card);
				dealerDraw();
			})
		})
	}
}

function newGame(){
	player.reset();
	dealer.reset();
	gameResult.value = '';
	wait(500, dealPhase);
}

function evaluatePlayerCards(){
	if(handScores.value.player > 21) endGame('BUST');
	else if(handScores.value.player == 21) revealPhase();
	else gameSequence.current = 'play';
}

function evaluateDealerCards(){
	if(handScores.value.player == 21 && handScores.value.dealer != 21) endGame('BLACK JACK');
	else if(handScores.value.player > handScores.value.dealer || handScores.value.dealer > 21) endGame('WIN');
	else if(handScores.value.player < handScores.value.dealer) endGame('LOSE');
	else endGame('PUSH');
}

function endGame(result){
	wait(300, () => {
		gameSequence.current = 'end';
		gameResult.value = result;
	})
}

function wait(ms, callback){
	return new Promise(resolve => {
		setTimeout(() => {
			callback();
			resolve();
		}, ms)
	})
}

deck.newDeck().then(dealPhase);
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
				:class="[
					'score',
					{
						'blackjack': handScores.dealer == 21,
						'bust': handScores.dealer > 21
					}
				]" 
				v-if="
				dealer.hand.length > 0 &&
				(gameSequence.current == 'reveal' || gameSequence.current == 'end') &&
				gameResult != 'BUST'">
				{{ handScores.dealer }}
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
			<span 
				id="player-score" 
				:class="[
					'score',
					{
						'blackjack': handScores.player == 21,
						'bust': handScores.player > 21
					}
				]" 
				v-if="gameSequence.current != 'deal' && player.hand.length > 0">
				{{ handScores.player }}
			</span>
		</div>

		<PlayerActions
			:class="{active : gameSequence.current == 'play'}"
			@check-hit="evaluatePlayerCards"
			@stand="revealPhase"
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
			@include flex($align:center, $justify: center);
			font-size: 1.5rem;
			font-weight: 600;
			width: 3rem;
			height: 3rem;
			border-radius: 3rem;
			right: -1.5rem;
			top: -1.5rem;
			background: white;

			&.blackjack{
				background-color: $color-blackjack;
			}
			&.bust{
				background-color: $color-lose;
			}
		}
	}
}
</style>
