import { reactive } from 'vue';
import { wait } from '../../utils.js';
import { loadDeck, draw } from '../../deckService.js'
import { player, dealer } from './';

export const game = reactive({
    phase: '',
    deck: null,
    result: '',

    async gameStart(){
        this.phase = 'deal';
        this.deck = await loadDeck();
        await this.deal();
    },
    async draw(count = 1){
        const cardDraw = await draw(this.deck.deck_id, count);
        this.deck = {...cardDraw};
    },
    async deal(){
        await this.draw(4);

        const [ a, b, c, d] = this.deck.cards;

        dealer.addCard(a, true)
		await wait(300, () => player.addCard(b))
		await wait(300, () => dealer.addCard(c))
		await wait(300, () => player.addCard(d))
        await wait(500, () => this.evaluatePlayerCards())
    },
    evaluatePlayerCards(){
        if(player.score > 21) this.endGame('BUST');
	    else if(player.score == 21) this.reveal();
	    else this.phase = 'play';
    },
    reveal(){
        dealer.revealHand();
        this.phase = 'reveal';
        this.dealerDraw();
    },
    async dealerDraw(){
        if(dealer.score >= 17) return this.evaluateDealerCards();
        
        await this.draw();

        const [ card ] = this.deck.cards;
        dealer.addCard(card);

        await wait(500, () => this.dealerDraw());
    },
    evaluateDealerCards(){
        if(player.score == 21 && dealer.score != 21) this.endGame('BLACK JACK');
        else if(player.score > dealer.score || dealer.score > 21) this.endGame('WIN');
        else if(player.score < dealer.score) this.endGame('LOSE');
        else this.endGame('PUSH');
    },
    async hit(){
        await this.draw();
        const [ card ] = this.deck.cards;
        player.addCard(card);
        this.evaluatePlayerCards();
    },
    endGame(result){
        this.phase = 'end';
        this.result = result;
    },
    async newGame(){
        player.hand = [];
        dealer.hand = [];
        this.phase = '';
        this.result = '';
        await wait(500, () => this.deal())
    }
});