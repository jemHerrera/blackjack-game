<script setup>
	import { player } from '../stores/player';

	const emits = defineEmits(['checkHit', 'stand'])

	function doubleDown(){
		
	}
	function split(){
		
	}
	function stand(){
		emits('stand');
	}
	function hit(){
		emits('checkHit');
	}

</script>

<template>
	<div id="player-actions">
		<div id="player-wager">
			<img 
			src="/images/chip-green.png" 
			class="chip" 
			v-for="wager in player.wager" 
			:key="wager"
			/>
		</div>
		<div class="user-controls">
			<button id="double-down" @click="doubleDown">Double Down</button>
			<button id="split" @click="split">Split</button>
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
					height: 2.5em;
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
				}

				#chips{
					@include flex($align:center, $gap: 0.5em);
					*{color: white}
					font-size: 1.5rem;

					.coin-icon{
						img{
							height: 2em;
						}
					}
				}
			}
		}
</style>