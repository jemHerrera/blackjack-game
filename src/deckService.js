async function loadDeck(deckCount = 1) {
    const response = fetch(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${deckCount}`)
    .then(res => res.json())
    .then(res => {
        if(!res.success) throw new Error('Failed to fetch deck');
        return res;
    })

    return await response;
}

async function draw(deckId, count) {
    const response = fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`)
    .then(res => res.json())
    .then(res => {
        if(!res.success) throw new Error('Failed to draw card(s)');
        return res;
    })
    
    return await response;
}

async function shuffle(deckId){
    const response = fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/shuffle/`)
    .then(res => res.json())
    .then(res => {
        if(!res.success) throw new Error('Failed to shuffle deck');
        return res
    })

    return await response
}

export { loadDeck, draw, shuffle };