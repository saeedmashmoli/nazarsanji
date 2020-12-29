<script>
    import LuckeyWheel from '../components/questions/LuckeyWheel.svelte';
    import SingleSelect from '../components/questions/SingleSelect.svelte';
    import MultiSelect from '../components/questions/MultiSelect.svelte';
    import Descryptive from '../components/questions/Descryptive.svelte';
    import Welcome from '../components/questions/Welcome.svelte';
    import Bye from '../components/questions/Bye.svelte';
    import {checkOperator} from '../utilis/functions';
    import {getOptionsFn} from '../Api/commentApi';
    import { push , location } from 'svelte-spa-router';
    import {questions  , question,comments, smsId, conditions } from '../stores'
    import QuestionBar from '../components/questions/QuestionBar.svelte';
    import { onMount } from 'svelte';
    import Toast from '../components/Toast.svelte';
    export let token = $location.split('/').slice(-1)[0];
    export let loading = false;
    onMount(async() => {
        loading = true;
        const data = await getOptionsFn(token);
        if(data.status){
            $questions = data.questions;
            $question = data.questions[0];
            $comments = data.comments;
            $smsId = data.smsId
            loading = false
        }else{
            push('/not-found');
        }
        

    })

    const setConditions = async (num) => {
        let array = await $questions.filter(q => q.turn === $question.turn + num);
        if(array.length > 0 ){
            $conditions = await array[0].conditions;
        }
    }
    const checkConditions = async () => {
        let jump = true;
        await $conditions.forEach(async(cond) => {
            const commentChecks = await $comments.filter(c => c.questionId === cond.questionId);
            if(commentChecks.length){
                commentChecks.forEach( async(check) => {
                    const res = await checkOperator(check.answerId , cond.answerId,cond.criteria.symbol);
                    if(!res){
                        jump = false
                    }
                })
            }
        });
        if(await jump && jump === false){
            return false
        }else{
            return true;
        }
    }
    const getQuestions = async (type) => {

        if(type === 'next'){
            await(setConditions(1))
            if($conditions.length) {
                const result = await checkConditions();
                if(!result){
                    $question = $questions[$question.turn + 1];
                    await(setConditions(1));
                }else{
                    $question = $questions[$question.turn];
                }
            }else{
                $question = $questions[$question.turn];
            }
        }else{
            await(setConditions(-1));
            if($conditions.length) {
                const result = await checkConditions();
                if(!result){
                    $question = $questions.filter( q => q.turn === $question.turn - 2)[0];
                    await(setConditions(-1))
                }else{
                    $question = $questions.filter( q => q.turn === $question.turn - 1)[0];
                }
            }else{
                $question = $questions.filter( q => q.turn === $question.turn - 1)[0];
            }
        }
    }

</script>
<style>
    .main {
        background: url('/images/back2.jpeg');
        background-size: cover;
        direction: rtl;
        height: 100vh;
        text-align: center ;
    }
    .column {
        height: 100vh;
        margin: auto !important;
        padding: 2%;
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        align-content: center;
    }
    .section {
        width: 80%;
        border-radius: 8px;
        background: url('/images/download.jpg');
        background-size: cover;
        margin: auto;
        padding: 1.5rem !important;
    }
    @media only screen and (max-width: 767px) {
        .column {
            padding: 0;
        }
        .section{
            width: 100%;
        }
   }
   
</style>
<Toast />
<svelte:head>
	<title>کامنت</title>
</svelte:head>
{#if loading}
    <progress class="progress is-small is-primary" max="100">15%</progress>
{:else}
    <div class="columns main is-vcentered">
        
        <div class="column">
            <section class="section">
                <QuestionBar />
                {#if $question?.typeId === 5}
                    <Welcome on:next={() => getQuestions("next")} on:previous={() => getQuestions("previous")} />
                {:else if $question?.typeId === 1}
                    <SingleSelect on:next={() => getQuestions("next")} on:previous={() => getQuestions("previous")} />
                {:else if $question?.typeId === 2}
                    <MultiSelect on:next={() => getQuestions("next")} on:previous={() => getQuestions("previous")} />
                {:else if $question?.typeId === 3}
                    <Descryptive on:next={() => getQuestions("next")} on:previous={() => getQuestions("previous")} />
                {:else if $question?.typeId === 4}
                    <LuckeyWheel on:next={() => getQuestions("next")} on:previous={() => getQuestions("previous")} />
                {:else if $question?.typeId === 6}
                    <Bye />
                {:else}
                    <p>قالبی برای این نوع سوال طراحی نشده است</p>
                {/if}

            </section>
        </div>
    </div>
{/if}