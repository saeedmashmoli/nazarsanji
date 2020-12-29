<script>
    import {question} from '../../stores';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    const getCloseBrowser = () => {
        window.document.write("");
    }
    const getPreviousQuestion = () => {
        dispatch('previous');  
    }
</script>
<style>

    p {
        font-weight: bold;
        font-size: 1rem;
    }
    .selected {
        padding: 2.5% 5%;
        font-weight: bold;
        font-size: 1rem;
        color: rgb(219, 230, 230);
        width: 100%;
        margin-top: 5%;
    }
    .question {
        height: 100%;
        position: relative;
    }
    .right-button {
        float: right;
    }
    .buttons-div {
        margin-top: 5%;
    }

</style>

<div class="question">
    <p>
        {@html $question.title} 
    </p>  
    <button on:click={getCloseBrowser} class="button is-primary selected">
        خدا نگهدار
    </button>
    <div class="buttons-div">
        {#if !$question.isUsedOk}
            <button on:click={getPreviousQuestion} class="button is-danger right-button">« بازگشت</button>
        {/if}
    </div>
</div>

