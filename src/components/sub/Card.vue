<script setup>
    import { computed } from 'vue';

    const props = defineProps({
        card: Object
    })

</script>

<template>
    <div :class="['card', {facedown: card.facedown}]">
        <img :src="card.image" />
    </div>
</template>

<style lang="scss">
    @use '../../styles/abstracts' as *;

    .card{
        @include flex;
        position: relative;
        width: 150px;
        border-radius: 10px;
        overflow: hidden;

        img{
            transition: all 300ms ease;
            width: 100%;
        }

        &.facedown{
            img{
                transform: rotateY(90deg);
            }
            &::after{
                content: '';
                background: url('/images/backside.jpg') no-repeat;
                background-size: contain;
                position: absolute;
                height: 100%;
                width: 100%;
            }
        }
    }
</style>