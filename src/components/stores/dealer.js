import { reactive } from 'vue';
import { getHandScore, wait } from '../../utils';
import { game } from '../stores';

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
	},
    async dealerDraw(){
        if(this.score >= 17) return game.evaluateDealerCards();
        await game.draw();
        const [ card ] = game.deck.cards;
        this.addCard(card);
        wait(500, () => this.dealerDraw());
    }
})