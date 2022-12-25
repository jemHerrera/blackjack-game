<script setup>
import { player, dealer, game } from '../stores/'
import { Card, Results, PlayerActions } from '../sub'

game.gameStart();
</script>

<template>
	<div id="game">
		<div id="playing-area">
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
		</div>
		<PlayerActions
			:class="{active : game.phase == 'play'}"
			@hit="player.hit()"
			@stand="game.playDealerHand()"
			@doubleDown="player.doubleDown()"
		/>
		<Results 
			:game-result="game.result"
			:player-chips="player.chips"
			@new-round="game.newRound()"
		/>
		<div v-if="game.deck" class="deck-count">
			<p class="remaining">Remaining cards: <b>{{ game.deck.remaining }}</b></p>
			<i class="shuffle-info">Re-shuffles at 100</i>
		</div>
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
	overflow: hidden;

	#playing-area{
		@include flex($direction:column, $align: center, $justify:space-between);
		flex-grow: 1;
		width: 100%;
		padding: 1rem;

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

					@include media-xs{
						font-size: 0.7rem;
					}
				}

				@include media-xs{
					gap: 0rem;
					margin-left:5em;
				}
			}

			&#player-hand-container{
				margin-bottom: 3rem;
				&.card-zoom{
					transform: scale(1.2);
				}

				@include media-xs{
					margin: 0;
					font-size: 0.9rem;
					&.card-zoom{
						transform: scale(1.05);
					}
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

		@include media-l{
			padding: 5rem 0;
		}
	}

	.deck-count{
		position: absolute;
		right: 0;
		top: 0;
		margin: 1rem;
		@include flex($direction:column, $align:flex-end, $gap: 0.25em);

		.remaining{
			color:white;
		}
		.shuffle-info{
			font-size: 0.9em;
			color: $color-glight2;
			text-align: right;
		}
	}

	@include media-xs{
		padding: 1rem;
	}
}
</style>
