import { createApp } from 'vue'
import { documentHeight } from './utils';
import Blackjack from './Blackjack.vue'

createApp(Blackjack).mount('#blackjack')
window.addEventListener('resize', documentHeight);
documentHeight()
