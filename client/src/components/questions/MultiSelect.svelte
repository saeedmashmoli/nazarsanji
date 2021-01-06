<script>
    import {question , smsId , comments , showBackButton} from '../../stores';
    import { createEventDispatcher } from 'svelte';
    import {createCommentFn} from '../../Api/commentApi';
    export let answerIds = [];
    const selectComments = async () => {
        let comm = [];
        let array = $comments.filter(c => c.questionId === $question.id);
        await array.forEach(a => {
            comm.push(a.answerId)
        })
        return comm;
    }
    const dispatch = createEventDispatcher();
    const changeAnswerIds = (answerId , element) => {
        if(!element.classList.contains("active")){
            element.classList.add("active");
            element.style.background = "rgb(96 161 200)";
            answerIds.push(answerId)
        }else{
            element.style.background = "#4e6e81";
            element.classList.remove("active")
            answerIds = answerIds.filter(a => a !== answerId);
        }
    }
    const getNextQuestion = async () => {
        if(answerIds.length === 0 && $question.shouldBe){
            window.pushToast(`پاسخگویی به این سوال الزامی است`, "red")
        }else{
            if($question.isUsedOk){
                $showBackButton = false;
            }
            if(answerIds.length !== 0){
                const response = await createCommentFn({smsId : $smsId , questionId : $question.id, answerIds});
                if(response.status){
                    $comments = await $comments.filter(c => (c.questionId !== $question.id));
                    await answerIds.forEach(answerId => {
                        $comments.push({ questionId : $question.id , answerId});
                    });
                }
            }
            await dispatch('next'); 
        }
    }
    const getPreviousQuestion = () => {

        dispatch('previous');  
    }
</script>
<style>
    .selected {
        padding: 2.5% 5%;
        font-weight: bold;
        font-size: 1rem;
        color: rgb(219, 230, 230);
        width: 100%;
        margin-top: 0.5%;
        background-color: #4e6e81;
    }
    .active {
        background: rgb(96 161 200) !important;
    }
    p {
        margin-bottom: 5%;
        font-weight: bold;
    }
    img {
        width: 30px;
        height: 30px;
    }
    .left-button {
        float: left;
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
    .selected:hover {
        background-color: rgb(96 161 200) !important;
    }
    .fa-check{
        color: greenyellow;
    }
</style>
<div class="question">
    <p>
        {@html $question.title} <b>{$question.shouldBe ? "*" : ""}</b>
    </p>
    {#each $question.answers as answer}
        <button 
            on:click={(e) => changeAnswerIds(answer.id , e.path[0])} 
            class={`button selected`}
        >

            {answer.title} 
            {#await selectComments()}
                <i></i>
            {:then items} 
                {#if items.includes(answer.id)}
                    <i class="fas fa-check"></i>
                {/if}
            {/await}
            {#if answer.image}
                <img alt="answer" src={answer.image} />
            {/if}
        </button>
    {/each}
    <div class="buttons-div">
        <button on:click={getNextQuestion} class="button is-success left-button">بعدی »</button>
    {#if $showBackButton}
        <button on:click={getPreviousQuestion} class="button is-danger right-button">« بازگشت</button>
    {/if}
    </div>
</div>