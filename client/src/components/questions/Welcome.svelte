<script>
    import {question} from '../../stores';
    import { createEventDispatcher } from 'svelte';
    export let chackedSms = true;
    const dispatch = createEventDispatcher();

    const getNextQuestion = () => {
        dispatch('next');
    }
</script>
<style>

    p {
        font-weight: bold;
        font-size: 1rem;
    }
    button {
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
</style>

<div class="question">
    <p>
        {@html $question.title}
    </p>  
    <button on:click={getNextQuestion} class="button is-primary">
        شرکت در نظرسنجی
    </button>
</div>

