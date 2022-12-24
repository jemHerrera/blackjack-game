async function wait (ms, callback){
	setTimeout(() => {
		callback();
	}, ms)
}

function getCardValue(card){
	if(['JACK', 'QUEEN', 'KING'].find(royal => card.value == royal)) return 10;
	else if(card.value == 'ACE') return 1;
	else return Number(card.value);
}

function getHandScore(hand){
	if(hand.length < 2) return null;

	// value of the hand where ace is just == 1
	const baseScore = hand.reduce((a,b) =>  a + getCardValue(b), 0);
	const aceCount = hand.filter((card) => card.value == 'ACE').length;

	if(aceCount > 0){
		// potential values of the hand with all the ace values. Values increment by 10 for each ace in the hand
		const potentialHands = [];
		for(let i = 0; i <= aceCount; i++) potentialHands.push(baseScore + (i * 10))

		//filter scores > 21
		const playableHands = potentialHands.filter(score => score <= 21)
		//if all scores are > 21(bust), best score becomes lowest value from potential hands; else find the highest value from playable hands
		return playableHands.length > 0 ? playableHands.reduce((a,b) => Math.max(a,b)) : potentialHands.reduce((a,b) => Math.min(a,b));
	}

	return baseScore
}

export { wait, getCardValue, getHandScore }