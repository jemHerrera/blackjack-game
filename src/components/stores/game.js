import { reactive } from 'vue';
import { wait } from '../../utils.js';
import { loadDeck, draw } from '../../deckService.js'
import { player } from './player.js';
import { dealer } from './dealer.js';

export const game = reactive({
    phase: '',
    deck: null,
    result: '',

    async gameStart(){
        this.phase = 'deal';
        this.deck = await loadDeck();
        await this.deal();
    },
    async deal(){
        const cardDraw = await draw(this.deck.deck_id, 4);
        this.deck = {...cardDraw};

        const [ a, b, c, d] = this.deck.cards;

        wait(0, () => dealer.addCard(a, true))
		.then(() => wait(300, () => player.addCard(b)))
		.then(() => wait(300, () => dealer.addCard(c)))
		.then(() => wait(300, () => player.addCard(d)))
        .finally(() => wait(500, () => this.evaluatePlayerCards()));
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
        const cardDraw = await draw(this.deck.deck_id, 1);
        this.deck = {...cardDraw};

        const [ card ] = this.deck.cards;
        dealer.addCard(card);
        this.dealerDraw();
    },
    evaluateDealerCards(){
        if(player.score == 21 && dealer.score != 21) this.endGame('BLACK JACK');
        else if(player.score > dealer.score || dealer.score > 21) this.endGame('WIN');
        else if(player.score < dealer.score) this.endGame('LOSE');
        else this.endGame('PUSH');
    },
    async hit(){
        const cardDraw = await draw(this.deck.deck_id, 1);
        this.deck = {...cardDraw};

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
        wait(500, () => this.deal());
    }
});