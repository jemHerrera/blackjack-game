<script setup>
	import { computed } from 'vue';

	const props = defineProps({
		gameResult: String
	})

	const classes = computed(() => {
		return {
			'blackjack': props.gameResult == 'BLACK JACK',
			'lose': props.gameResult == 'LOSE' || props.gameResult == 'BUST'
		}
	})

	defineEmits(['newGame'])

</script>

<template>
	<transition name="fade">
    <div v-if="gameResult" id="result-overlay" @click="$emit('newGame')">
		<h2 :class="classes">{{ gameResult }}</h2>
		<p>Click anywhere to continue</p>
	</div>
	</transition>
</template>

<style lang="scss">
    @use '../../styles/abstracts' as *;

		#result-overlay{
			width: 100%;
			height: 100%;
			top:0;
			left:0;
			position: absolute;
			@include flex($direction:column, $align:center, $justify:center, $gap:1rem);
			background: rgba(0, 0, 0, 0.8);
			
			h2{
				font-size: 4rem;
				color: white;

				&.blackjack{
					color: $color-blackjack;
				}
				&.lose, &.bust{
					color: $color-lose;
				}
			}
			p{
				color: white;
			}
		}
    
</style>