<script>
    import {question , smsId , comments , showBackButton} from '../../stores';
    import {createCommentFn} from '../../Api/commentApi'
    import { createEventDispatcher } from 'svelte';
    export let comment = $comments.filter(c => c.questionId === $question.id)[0];
    export let text = comment ? comment.text : "";
    const dispatch = createEventDispatcher();

    const getNextQuestion =  async() => {
        if(text.trim() === "" && $question.shouldBe){
            window.pushToast(`پاسخگویی به این سوال الزامی است`, "red")
        }else{
            if($question.isUsedOk){
                $showBackButton = false;
            }
            if(text.trim() !== ""){
                const response = await createCommentFn({smsId : $smsId , questionId : $question.id, text});
                if(response.status){
                    let co = {text , smsId : $smsId , questionId : $question.id};
                    $comments = await $comments.filter((c) => c.questionId !== $question.id);
                    await $comments.push(co);
                }
            }
            dispatch('next');  
        }
    }
    const getPreviousQuestion = () => {
        dispatch('previous');  
    }
</script>
<style>
    p {
        margin-bottom: 5%;
        font-weight: bold;
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
    textarea{
        height : 150px;
        resize: none;
        padding: 2%;
        background: #fefefe;
        border-radius: 8px;
        color: black;
    }
    @media only screen and (max-width: 767px) {
        textarea {
            padding: 3% 5%;
        }
    }
    b {
        color: red;
    }
</style>
<div class="question">
    <p>
        {@html $question.title} <b>{$question.shouldBe ? "*" : ""}</b>
    </p>
    <textarea placeholder="توضیحات خود را بنویسید..." class="input" bind:value={text}></textarea>
    <div class="buttons-div">
        <button on:click={getNextQuestion} class="button is-success left-button">بعدی »</button>
        {#if $showBackButton && $question.turn !== 1}
            <button on:click={getPreviousQuestion} class="button is-danger right-button">« بازگشت</button>
        {/if}
    </div>
</div>