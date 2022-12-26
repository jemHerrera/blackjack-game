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
			src="/images/chip-vue.png" 
			class="chip" 
			v-for="(wager, index) in player.wager" 
			:key="index"
			/>
		</transition-group>
		<div class="user-controls">
			<button id="double-down" @click="doubleDown" :class="{'visible': game.phase=='play' && player.hand.length == 2 && player.chips >= 2}">Double Down</button>
			<button id="split" @click="split"><span>Split</span><span class="coming-soon">Coming Soon</span></button>
			<div id="chips">
				<span class="coin-icon"><img src="/images/chip-vue.png"/></span>
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
		@include flex($justify: center);
		font-size: 2rem;
		height: 2em;
		margin-left: 1em;

		.chip{
			height: inherit;
			margin-left: -1em;
			transition: all 0.5s ease;
		}

		@include media-xxs{
			font-size: 1.5rem;
		}
	}

	.user-controls{
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-gap: 1.5rem;
		pointer-events: none;
		justify-content: center;
		position: relative;

		button{
			flex: 1;
			padding: 1em;
			font-size: 1.5rem;
			text-transform: uppercase;
			cursor: pointer;
			opacity: 0.1;
			background: $color-glight1;
			border-radius: 1rem;
			color: white;
			font-weight: 600;

			&#split{
				@include flex($direction:column, $align:center, $justify:center, $gap: 0.2em);
				opacity: 0.1;
				pointer-events: none;

				span.coming-soon{
					font-size: 0.7em;
					font-style: italic;
				}
			}
			&#double-down{
				opacity: 0.1;
				pointer-events: none;

				&.visible{
					opacity:1;
					pointer-events: visible;
				}
			}
			
			&:hover{
				background-color: $color-glight2;
			}
		}

		#chips{
			@include flex($align:center, $justify:center, $gap: 0.5em);
			*{color: white}
			font-size: 1.5rem;
			position: relative;
			border: 3px solid $color-gdark2;
			border-radius: 999px;

			.coin-icon img{
				height: 2em;
			}
			.material-icons{
				font-size: 1.5em;
			}
			.coin-quantity{
				font-size: 1.5em;
			}
		}

		@include media-l{
			button{
				font-size: 1rem;
			}
			#chips{
				font-size: 1rem;
			}
		}

		@include media-s{
			grid-gap: 0.5rem;
			#chips{
				font-size: 0.8rem;
				border:none;
			}
		}

		@include media-xs{
			grid-template-columns: repeat(4, 1fr);

			button{
				padding: 1em 0.5em;
				font-size: 0.9em;
			}

			#chips{
				position: absolute;
				width: 100%;
				top: -2.5rem;
			}
		}

		@include media-xxs{

			button{
				font-size: 0.7em;
			}

			#chips{
				font-size: 0.6rem;
			}
		}
	}

	@include media-m{
		gap: 6rem;
	}

	@include media-xxs{
		gap: 5rem;
	}
}
</style>