import { reactive } from 'vue';
import { wait } from '../../utils.js';
import { loadDeck, draw, shuffle } from '../../deckService.js'
import { player, dealer } from './';

export const game = reactive({
    phase: '',
    deck: null,
    result: '',

    async gameStart(){
        this.phase = 'deal';
        this.deck = await loadDeck(6);
        player.placeWager(2);
        this.deal();
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
    evaluatePlayerCards(noResultCallback = () => game.phase = 'play'){
        if(player.score > 21) this.endRound('BUST');
	    else if(player.score == 21) this.playDealerHand();
	    else noResultCallback();
    },
    async playDealerHand(){
        this.phase = 'reveal';
        await wait(500, () => dealer.revealHand());
        wait(1000, () => dealer.dealerDraw());
    },
    evaluateDealerCards(){
        if(player.score == 21 && dealer.score != 21) this.endRound('BLACK JACK');
        else if(player.score > dealer.score || dealer.score > 21) this.endRound('WIN');
        else if(player.score < dealer.score) this.endRound('LOSE');
        else this.endRound('PUSH');
    },
    endRound(result){
        this.phase = 'end';
        this.result = result;
        wait(300, () => player.evaluateChips(result));
    },
    async newRound(){
        this.phase = '';
        this.result = '';
        player.reset();
        dealer.reset();
        if(this.deck.remaining < 100) await shuffle(this.deck.deck_id);
        wait(500, () => this.deal());
    }
});