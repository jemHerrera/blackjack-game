import { reactive } from 'vue';

export const dealer = reactive({
	hand: [],
	addCard(card, facedown=false){
		card.facedown = facedown;
		this.hand.push(card);
	},
	reset(){
		this.hand = [];
	}
})