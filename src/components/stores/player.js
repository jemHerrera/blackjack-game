import { reactive } from 'vue';
import { getHandScore, wait } from '../../utils';
import { game } from '../stores';

export const player = reactive({
	hand: [],
	score: 0,
	chips: 14,
	wager: 0,
	addCard(card){
		this.hand.push(card);
		this.score = getHandScore(this.hand);
	},
	reset(){
		this.collectWager();
		if(player.chips < 2) player.chips = 14;
		this.hand = [];
		wait(500, () => {
			this.placeWager(2);
		});
	},
	placeWager(amount){
		this.wager = amount;
		this.chips -= this.wager;
	},
	collectWager(){
		this.chips += this.wager;
		this.wager = 0;
	},

    async hit(){
        await game.draw();
        const [ card ] = game.deck.cards;
        this.addCard(card);
        game.evaluatePlayerCards();
    },

	async doubleDown(){
		const betIncrease = this.wager;
		this.wager += betIncrease;
		this.chips -= betIncrease;
		await game.draw();
        const [ card ] = game.deck.cards;
		await wait(500, () => this.addCard(card));
        game.evaluatePlayerCards(() => {
			wait(500, () => game.playDealerHand())
		});
	},

	evaluateChips(result){
		if(result == 'BLACK JACK') {
			let blackJackMultiplier = this.wager % 2 == 0 ? 1.5 : 2;
			this.wager += (this.wager * blackJackMultiplier);
		}
		else if(result == 'LOSE' || result == 'BUST') this.wager = 0;
		else if(result == 'WIN') this.wager *= 2;
	}
})