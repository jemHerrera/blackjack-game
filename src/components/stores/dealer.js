import { reactive } from 'vue';
import { getHandScore } from '../../utils';

export const dealer = reactive({
	hand: [],
	score: 0,
	addCard(card, facedown=false){
		card.facedown = facedown;
		this.hand.push(card);
		this.score = getHandScore(this.hand);
	},
	revealHand(){
		this.hand[0].facedown = false;
	},
	reset(){
		this.hand = [];
	}
})