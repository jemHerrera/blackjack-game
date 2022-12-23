	<script setup>
	import { deck } from '../stores/deck';
	import { dealer } from '../stores/dealer';
	import { player } from '../stores/player';
	import { gameSequence } from '../stores/gameSequence';

	const emits = defineEmits(['checkResult'])
	const props = defineProps({
		wait: Function
	})

	function doubleDown(){
		
	}
	function split(){
		
	}
	function stand(){
		dealer.hand[0].facedown = false;
		gameSequence.current = 'reveal';
		wait(300, () => {

		})
	}
	function hit(){
		deck.draw(1, (response) => {
			const [ card ] = response.cards;
			player.addCard(card);
			emits('checkResult');
		})
	}
	function addBet(){
			
	}
	</script>

	<template>
		<div id="player-actions">
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
	</template>

	<style lang="scss">
			@use '../../styles/abstracts' as *;

			#player-actions{
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

				&.active button{
					opacity:1;
					pointer-events: visible;
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
	</style>