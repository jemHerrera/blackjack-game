import { reactive } from 'vue';

export const deck = reactive({
    value: {},
    newDeck(callback){
		return new Promise((resolve) => {
		fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
			.then(response => response.json())
			.then(response => {
				deck.value = response
				resolve();
			})
			.catch(error => console.error(error));
		})
	},
	draw(count, callback){
		fetch(`https://deckofcardsapi.com/api/deck/${deck.value.deck_id}/draw/?count=${count}`)
		.then(response => response.json())
		.then(response => {
			deck.value.count = response.remaining;
			callback(response);
		})
		.catch(error => console.error(error))
	},
	shuffle(){
		fetch(`https://deckofcardsapi.com/api/deck/${deck.value.deck_id}/shuffle/`)
		.then(response => response.json())
		.then(response => {
			console.log('shuffled')
			deck.value = response;
		})
	}
})