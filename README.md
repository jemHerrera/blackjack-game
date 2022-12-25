# BLACK JACK GAME using Vue 3 + Vite

A simple game of Black Jack powered by Vue and 
[Deck of Cards API](https://www.deckofcardsapi.com/). The player can play basic Black Jack actions such as Hit, Stand and Double Down. Split action coming soon. The main deck is composed of 6 decks total and reshuffles everytime remaining cards go down to less than 100.

## Github pages hosting Vite tutorial
[Youtube Tutorial here](https://www.youtube.com/watch?v=yo2bMGnIKE8)

```
<!-- Build -->
npm run build
<!-- Set vite config base -->

export default defineConfig({
    base:'/blackjack-game/'
})

<!-- Push to gh-pages branch -->
git add dist -f
git commit -m "gh commit"
git subtree push --prefix dist origin gh-pages
```