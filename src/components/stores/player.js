import { reactive } from 'vue';

export const player = reactive({
	hand: [],
	chips: 24,
	wager: 1,
	addCard(card){
		this.hand.push(card);
	},
	reset(){
		this.hand = [];
		this.wager = 1;
	}
})