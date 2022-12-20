<script setup>
	import { computed } from 'vue';

	const props = defineProps({
			endResult: String
	})

	defineEmits(['reset'])

</script>

<template>
	<transition name="fade">
    <div v-if="endResult" id="result-overlay" @click="$emit('reset')">
			<h2 v-if="endResult == 'BLACK JACK'">BLACK JACK!</h2>
			<h2 v-else-if="endResult == 'BUST'">BUST</h2>
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
				font-size: 3rem;
				color: white;
			}
			p{
				color: white;
			}
		}
    
</style>