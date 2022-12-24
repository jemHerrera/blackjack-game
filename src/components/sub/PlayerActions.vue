<script setup>
	import { computed } from 'vue';
	import { player } from '../stores/player';
	import { game } from '../stores'

	const emits = defineEmits(['hit', 'stand', 'doubleDown'])

	const chipAnimation = computed(() => {
		if(game.phase == 'end') return 'chipout'
		return 'chipin';
	})

	const splitAvailable = computed(() => {
		return player.hand.length == 2 &&
		player.hand[0].value == player.hand[1].value
	})

	function doubleDown(){
		emits('doubleDown');
	}
	function split(){
		
	}
	function stand(){
		emits('stand');
	}
	function hit(){
		emits('hit');
	}

</script>

<template>
	<div id="player-actions">
		<transition-group :name="chipAnimation" tag="div" id="player-wager">
			<img 
			src="/images/chip-green.png" 
			class="chip" 
			v-for="(wager, index) in player.wager" 
			:key="index"
			/>
		</transition-group>
		<div class="user-controls">
			<button :class="{'active': player.hand.length == 2}" id="double-down" @click="doubleDown">Double Down</button>
			<button :class="{'active': splitAvailable}" id="split" @click="split">Split</button>
			<div id="chips">
				<span class="coin-icon"><img src="/images/chip-green.png"/></span>
				<span class="material-icons">clear</span>
				<span class="coin-quantity">{{player.chips}}</span>
			</div>
			<button id="stand" @click="stand">Stand</button>
			<button id="hit" @click="hit">Hit</button>	
		</div>
	</div>
</template>

<style lang="scss">
		@use '../../styles/abstracts' as *;

		#player-actions{
			@include flex($direction:column, $align:center, $gap:3rem);

			&.active .user-controls button{
				opacity:1;
				pointer-events: visible;
			}

			#player-wager{
				@include flex($justify: center, $gap: 1rem);
				font-size: 2rem;
				.chip{
					height: 2em;
					transition: all 0.5s ease;
				}
			}
			.user-controls{
				@include flex($justify:center, $gap: 1.5rem);
				pointer-events: none;

				button{
					flex: 1;
					padding: 1em;
					font-size: 1.5rem;
					text-transform: uppercase;
					cursor: pointer;
					opacity: 0.3;
					transition: all 300ms ease;

					&#doubledown, &#split{
						opacity: 0.3;
						pointer-events: none;

						&.active{
							opacity:1;
							pointer-events: visible;
						}
					}
				}

				#chips{
					@include flex($align:center, $gap: 0.5em);
					*{color: white}
					font-size: 1.5rem;
					position: relative;

					.coin-icon img{
						height: 2em;
					}
					.coin-quantity{
						font-size: 1.5em;
					}
				}
			}
		}
</style>