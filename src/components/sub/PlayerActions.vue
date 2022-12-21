	<script setup>

	const props = defineProps({
		player: Object
	})

	function doubleDown(){
		
	}

	function split(){

	}

	function stand(){

	}

	function hit(){

	}

	function addBet(){
			
	}
	</script>

	<template>
		<div id="player-actions">
				<button id="double-down">Double Down</button>
				<button id="split">Split</button>
				<div id="coins">
					<span class="coin-icon"><img src="/images/chip-green.png"/></span>
					<span class="material-icons">clear</span>
					<span class="coin-quantity">{{player.coins}}</span>
				</div>
				<button id="stand">Stand</button>
				<button id="hit">Hit</button>	
		</div>
	</template>

	<style lang="scss">
			@use '../../styles/abstracts' as *;

			#player-actions{
				@include flex($justify:center, $gap: 1.5rem);

				button{
					flex: 1;
					padding: 1em;
					font-size: 1.5rem;
					text-transform: uppercase;
					cursor: pointer;
				}

				#coins{
					@include flex($align:center, $gap: 0.5em);
					*{color: white}
					font-size: 2rem;

					.coin-icon{
						img{
							height: 2em;
						}
					}
				}
			}
	</style>