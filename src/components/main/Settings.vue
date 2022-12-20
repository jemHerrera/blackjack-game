<script setup>
    defineEmits(['close']);
</script>

<template>
    <div id="settings">
        <div class="settings-container">
            <header>
                <h1>BlackJack</h1>
                <h2>Built with <a href="https://vuejs.org/" target="_blank">Vue</a></h2>
            </header>
            <footer>
                <a href="https://jemherrera.github.io/portfolio/" target="_blank">{{new Date().getFullYear()}} Jem Herrera</a>
                <a href="https://github.com/jemHerrera/blackjack-game" target="_blank">Github Repo</a>
            </footer>
        </div>
        <div @click.stop="$emit('close')" aria-hidden class="background-overlay"></div>
    </div>
</template>

<style lang="scss">
    @use '../../styles/abstracts' as *;

    #settings{
        position: absolute;
        width: 100%;
        height: 100%;
        max-width: 360px;
        z-index: 2;

        .settings-container{
            position: relative;
            background-color: $color-gdark1;
            height: 100%;
            width: 90%;
            z-index: 1;
            border-right: 1px solid $color-glight1;
            @include flex($direction: column, $justify:center, $align:center);

            header{
                margin-bottom: 5rem;
                padding: 2rem;
                *{
                    text-align:center;
                }
                h1{
                    font-size: 3.25rem;
                    font-weight: bold;
                    color: white;
                }
                h2{
                    font-size: 1.5rem;
                    font-weight: 300;
                    color: $color-glight2;

                    a{
                        border-bottom: 2px solid transparent;
                        text-decoration: none;
                        font-weight: bold;
                        color: $color-main1;

                        &:hover{
                            border-bottom: 3px solid $color-main1;
                        }
                    }
                }
            }

            footer{
                position: absolute;
                bottom: 0;
                width: 100%;
                padding: 1rem;
                @include flex($direction: column, $align:center);

                a{
                    color: $color-glight1;
                    text-decoration: none;
                    font-size: 1rem;

                    &:hover{
                        color: white;
                    }
                }
            }
        }

        .background-overlay{
            position: absolute;
            width:100%;
            height: 100%;
            top:0;
            left:0;
            opacity: 0.5;
        }
        
        @include mdpi-up{
            position: relative;
            
            .settings-container{
                width: 100%;
            }
        }
    }
</style>