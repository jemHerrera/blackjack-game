import { reactive } from 'vue';

export const gameSequence = reactive({
    current: 'deal',
    phases: ['deal', 'play', 'resolve'],
    nextPhase(){
        const currentIndex = this.phases.indexOf(this.current);
        const nextIndex = currentIndex == this.phases.length - 1 ? 0 : currentIndex + 1;
        this.current = this.phases[nextIndex];
    }
})