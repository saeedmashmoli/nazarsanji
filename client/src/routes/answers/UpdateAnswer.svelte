<script>
    import {  notLoading   } from '../../utilis/functions';
    import { createOrUpdateAnswerFn , getAnswerFn} from '../../Api/answerApi';
    import { getQuestionsFn } from '../../Api/questionApi';
    import {loading} from '../../stores';
    import { onMount } from 'svelte';
    import { push , location } from 'svelte-spa-router';
    import Input from '../../components/Input.svelte';
    export let id = parseInt($location.split('/').slice(-1)[0]);
    export let title = "";
    export let link = "";
    export let image = "";
    export let percent;
    export let questionId ;
    export let status;
    export let flag;
    export let questions = [];
    export let errorMessages = [];
    onMount(async () => {
        $loading = true;
        const a = await getAnswerFn(id);
        const  q = await getQuestionsFn(true);
        if(q.status && a.status){
            const answer = a.answer
            status = answer.status;
            link = answer.link;
            percent = answer.percent;
            questionId = answer.questionId;
            title = answer.title;
            flag = answer.flag;
            questions = q.questions
        }else{
            replace('/server-error')
        }
        notLoading()
    })
        
    const createAnswer = async () => {
        const data = await createOrUpdateAnswerFn({title ,status ,link ,questionId ,flag , percent , image} ,id);
        if(data.status == true){
            push('/answers/show-answer')
        }else{
            errorMessages = data.errors
        }
    }
    $: checkErrors = (field) => {
        let i = {status : false ,message : ""};
        errorMessages.forEach(err => {
            if(err.field === field){
                i.status = true;
                i.message = err.message;
            }
        })
        return i;
    }
    const changeQuestionId =  (value) => {
        questionId =value
    }
</script>


<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
    {#if $loading}
        <progress class="progress is-small is-primary" max="100">15%</progress>
    {:else}
        <div class="p-2">
            <div class="columns is-variable is-desktop">
                <div class="column">
                    <h3 class="title text-center is-size-4">افزودن سوال</h3>
                </div>
            </div>
            <div style="margin: auto;" class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                <div class="box">
                    <div style="margin: auto;" class="back-eee box column p-3 is-6-desktop is-offset-6-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                        <Input label="شرح" type="text" placeholder="شرح؟" bind:title={title} icon="fa-heading" />
                        <Input label="لینک" type="text" placeholder="لینک گزینه؟" bind:title={link} icon="fa-link" />
                        <Input label="درصد" type="number" placeholder="درصد اختصاصی گزینه؟" bind:title={percent} icon="fa-percent" />
                        <div class="field" style="direction: ltr;">
                            <div class="d-inlineblock"> 
                                <div class="d-inlineblock status" >
                                    <input id="status" type="checkbox" class="switch is-rounded is-info" bind:checked={status}>
                                    <label for="status"></label>
                                </div>
                                <div class="d-inlineblock" style="position: relative; top: 5px">
                                    <label class="label">وضعیت</label> 
                                </div>
                            </div>
                            <div class="d-inlineblock" style="float: right"> 
                                <div class="d-inlineblock status" >
                                <input id="flag" type="checkbox" class="switch is-rounded is-info" bind:checked={flag}>
                                <label for="flag"></label>
                                </div>
                                <div class="d-inlineblock" style="position: relative; top: 5px">
                                    <label class="label">پاسخ نهایی</label> 
                                </div>
                            </div>
                            
                        </div>

                    </div>
                    <div class="field mt-3">
                        <label class="label">انتخاب سوال</label>
                        <div class="box columns mt-3 mb-5 is-multiline is-tablet back-eee">
                            {#each questions as question}
                                <div class="column">
                                    <div class="">
                                        <label class="checkbox">
                                            <input type="radio" name="questionId" checked={questionId == question.id} value={question.id} on:click={changeQuestionId(question.id)}>
                                            {question.title}
                                        </label>
                                    </div>
                                </div>
                               
                            {/each}   
                            <p class="help is-danger">{checkErrors("questionId").message}</p>                   
                        </div>
                    </div>

                    <div class="field is-grouped submit-parent" >
                            <button on:click={createAnswer} class="button is-link">ذخیره</button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>


