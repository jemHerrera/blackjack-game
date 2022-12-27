<script setup>
    import { ref, computed } from 'vue';

    const props = defineProps({
        card: Object
    })

    const loaded = ref(false);

    const cardClasses = computed(() => {
        return [
            'card',
            {
                facedown: props.card.facedown,
                loading: !loaded.value
            }
        ]
    })
</script>

<template>
    <div :class="cardClasses">
        <img :src="card.image" @load="loaded = true"/>
    </div>
</template>

<style lang="scss">
    @use '../../styles/abstracts' as *;

    .card{
        @include flex;
        position: relative;
        width: 8.5em;
        border-radius: 0.5em;
        overflow: hidden;
        transition: all 0.3s ease;
        background: url('/images/backside-vue.jpg') no-repeat;
        background-size: contain;

        img{
            transition: transform 300ms ease;
            width: 100%;
        }

        &.facedown{
            img{
                transform: rotateY(90deg);
            }
            
            &::after{
                content: '';
                background: url('/images/backside-vue.jpg') no-repeat;
                background-size: contain;
                position: absolute;
                height: 100%;
                width: 100%;
            }
        }

        &.loading{
            transition-delay: 0.3s;
        }

        &.enlarge{
            transform:scale(1.25);
        }

        @include media-xs{
            margin-left: -5em;
            box-shadow: rgb(0 0 0) 3.95px -3.95px 10.6px;
        }
    }
</style>