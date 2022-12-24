<script setup>
import { player, dealer, game } from '../stores/'
import { Card, Results, PlayerActions } from '../sub'

game.gameStart();
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
						'blackjack': dealer.score == 21,
						'bust': dealer.score > 21
					}
				]" 
				v-if="
				dealer.hand.length > 0 &&
				(game.phase == 'reveal' || game.phase == 'end') &&
				game.result != 'BUST'">
				{{ dealer.score }}
			</span>
		</div>

		<div 
			id="player-hand-container"
			ref="playerRef" 
			:class="['hand-container',{
				'card-zoom': game.phase == 'play'
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
						'blackjack': player.score == 21,
						'bust': player.score > 21
					}
				]" 
				v-if="game.phase && game.phase != 'deal' && player.hand.length > 0">
				{{ player.score }}
			</span>
		</div>

		<PlayerActions
			:class="{active : game.phase == 'play'}"
			@hit="player.hit()"
			@stand="game.playDealerHand()"
			@doubleDown="player.doubleDown()"
		/>

		<Results 
			:game-result="game.result"
			@new-game="game.newGame()"
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
			@include flex($gap: 0.5rem);

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
