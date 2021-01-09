<script>
    import {question , smsId , comments , showBackButton, call } from '../../stores';
    import {createCommentFn} from '../../Api/commentApi';
    import { createEventDispatcher } from 'svelte';
    import Title from './Title.svelte';
    export let comment = $comments.filter(c => c.questionId === $question.id)[0];
    const dispatch = createEventDispatcher();
    const getNextQuestion = async (answerId) => {
        if($question.isUsedOk){
            $showBackButton = false;
        }
        const response = await createCommentFn({smsId : $smsId , questionId : $question.id, answerIds :[answerId]});
        if(response.status){
            let co = {answerId , smsId : $smsId , questionId : $question.id};
            $comments = await $comments.filter((c) => c.questionId !== $question.id);        
            $comments.push(co)
            dispatch('next');  
        }else{
            window.pushToast(`پاسخگویی به این سوال الزامی است`, "red")
        }
    }
    const getPreviousQuestion = () => {
        dispatch('previous');
    }
    
</script>
<style>
    .question-button {
        padding: 2.5% 5%;
        font-weight: bold;
        font-size: 1rem;
        color: rgb(219, 230, 230);
        width: 100%;
        margin-top: 0.5%;
        background-color: #5b707d;
    }
    .question-button:hover {
        background-color: rgb(96 161 200) !important;
    }
    p {
        margin-bottom: 5%;
        font-weight: bold;
    }
    img {
        width: 30px;
        height: 30px;
    }
    .right-button {
        float: right;
    }
    .buttons-div {
        margin-top: 5%;
    } 
    b {
        color: red;
    }
    .fa-check{
        color: greenyellow;
    }
</style>
<div  class="question">
    <p>
        <Title object={$question} />
        <b>{$question.shouldBe ? "*" : ""}</b>
    </p>
    {#each $question.answers as answer}
        <button on:click={getNextQuestion(answer.id)} class="button question-button">
            {#if answer.title.includes("[callTime]")}
                {answer.title.replace("[callTime]",$call.callTime * answer.percent / 100)}
            {:else}
                {answer.title}
            {/if}
            {#if comment && answer.id === comment.answerId}
                <i class="fas fa-check"></i>
            {/if}
            {#if answer.image}
                <img alt="answer" src={answer.image} />
            {/if}
        </button>
    {/each}
    <div class="buttons-div">
        {#if $showBackButton && $question.turn !== 1}
            <button on:click={getPreviousQuestion} class="button is-danger right-button">« بازگشت</button>
        {/if}
    </div>
</div>