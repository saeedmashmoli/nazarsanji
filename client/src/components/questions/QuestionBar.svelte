<script>
    import { beforeUpdate } from 'svelte';
    import {question , questions} from '../../stores';
    export let selections = [];
    beforeUpdate(async () => {
        await $questions.forEach(async(q) => {
            const obj = {turn : q.turn , typeId : q.typeId};
            if(!selections.some(item => item.turn === obj.turn)){
                await selections.push(obj)
            }
        })
    })

</script>
<style>
    span { 
        display: inline-block;
        height: 10px;
        background: red;
        border-radius: 5px;
        margin-right: 2%;
        width: 98%;
    }
    .active {
        background: green;
    }
    .main-span {
        width: 100%;
        margin-bottom: 5%;
    }
    .gift {
        position: absolute;
        width: 32px;
        top: -110%;
        left: 40%;
    }
    .list-span {
        display: inline-block;
        padding: 0;
        margin: 0;
        position: relative;
        text-align: center;
    }
    .gift-main {
        width: 100%;
        height: 1px;
    }
    @media only screen and (max-width: 767px) {
        .gift {
            left : 20% !important
        }
    }
</style>
<div class="main-span">
    {#each selections as q}
        <div style={`width : ${(100 - selections.length)/selections.length}%`} class="list-span">
            {#if q.typeId === 4}
                <div class="gift-main">
                    <img class="gift" src="/images/gift.png" alt="gift"> 
                </div>
            {/if}
            <span class:active={q.turn === $question.turn}></span> 
        </div>
    {/each}
</div>
