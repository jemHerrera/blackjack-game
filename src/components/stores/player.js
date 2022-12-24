import { reactive } from 'vue';
import { getHandScore } from '../../utils';
export const player = reactive({
	hand: [],
	score: 0,
	chips: 24,
	wager: 1,
	async addCard(card){
		this.hand.push(card);
		this.score = getHandScore(this.hand);
	},
	reset(){
		this.hand = [];
		this.wager = 1;
	}
})