<script>
    import {  notLoading  } from '../../utilis/functions';
    import { getSurveysAndTypesForCreateOrUpdateQuestionFn , createOrUpdateQuestionFn  , getQuestionFn } from '../../Api/questionApi';
    import {loading} from '../../stores';
    import { onMount } from 'svelte';
    import { push , location } from 'svelte-spa-router';
    import Input from '../../components/Input.svelte';
    export let id = parseInt($location.split('/').slice(-1)[0]);
    export let title = "";
    export let typeId;
    export let turn;
    export let surveyId;
    export let status = true;
    export let shouldBe = true;
    export let isUsedOk = false;
    export let surveys = [];
    export let types = [];
    export let errorMessages = [];
    onMount(async () => {
        $loading = true;
        const d = await getSurveysAndTypesForCreateOrUpdateQuestionFn();
        const q = await getQuestionFn(id);
        if(!Number.isInteger(id)){
            replace('/not-found')
        } else if(q.status && d.status){
            title = q.question.title;
            turn = q.question.turn;
            status = q.question.status;
            shouldBe = q.question.shouldBe;
            isUsedOk = q.question.isUsedOk;
            surveyId = q.question.surveyId;
            typeId = q.question.typeId;
            surveys = d.surveys;
            types = d.types
        }else{
            replace('/server-error')
        }
        notLoading()
    })
        
    const updateQuestion = async () => {
        const data = await createOrUpdateQuestionFn({title ,status ,shouldBe ,typeId ,surveyId} , id);
        if(data.status == true){
            push('/questions/show-question/')
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
    const changeTypeId =  (input) => {
        typeId = parseInt(input.path[0].value)
    }
    const changeSurveyId =  (input) => {
        surveyId = parseInt(input.path[0].value)
    }
</script>
<svelte:head>
	<title>ویرایش سوال</title>
</svelte:head>

<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
    {#if $loading}
        <progress class="progress is-small is-primary" max="100">15%</progress>
    {:else}
        <div class="p-2">
            <div class="columns is-variable is-desktop">
                <div class="column">
                    <h3 class="title text-center is-size-4">ویرایش سوال</h3>
                </div>
            </div>
            <div style="margin: auto;" class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                <div class="box">
                    <div style="margin: auto;" class="back-eee box column p-3 is-6-desktop is-offset-6-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                        <Input errorClass={checkErrors("title").status} label="عنوان" placeholder="عنوان سوال؟" type="textarea" bind:title={title} icon="fa-heading" />
                        <p class="help is-danger">{checkErrors("title").message}</p>
                        <Input errorClass={checkErrors("turn").status} label="نوبت نمایش" placeholder="نوبت نمایش سوال؟" type="number" bind:title={turn} icon="fa-arrows-v" />
                        <p class="help is-danger">{checkErrors("turn").message}</p>
                        <div class="field" style="direction: ltr;">
                            <div class="d-inlineblock"> 
                                <div class="d-inlineblock status" >
                                    <input id="status" type="checkbox" class="switch is-rounded is-info" bind:checked={status}>
                                    <label for="status"></label>
                                </div>
                                <div class="d-inlineblock" style="position: relative; top: 5px">
                                    <label for class="label">وضعیت</label> 
                                </div>
                            </div>
                            <div class="d-inlineblock" style="float: right"> 
                                <div class="d-inlineblock status" >
                                <input id="shouldBe" type="checkbox" class="switch is-rounded is-info" bind:checked={shouldBe}>
                                <label for="shouldBe"></label>
                                </div>
                                <div class="d-inlineblock" style="position: relative; top: 5px">
                                    <label for class="label">الزام پاسخگویی</label> 
                                </div>
                            </div>
                            <div class="d-inlineblock" style="float: right;margin-right : 2%"> 
                                <div class="d-inlineblock status" >
                                <input id="isUsedOk" type="checkbox" class="switch is-rounded is-info" bind:checked={isUsedOk}>
                                <label for="isUsedOk"></label>
                                </div>
                                <div class="d-inlineblock" style="position: relative; top: 5px">
                                    <label for class="label">تایید کامنت</label> 
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="field mt-3">
                        <label for class="label">انتخاب نوع سوال</label>
                        <div class="box columns mt-3 mb-5 is-multiline is-tablet back-eee">
                            {#each types as type}
                                <div class="column">
                                    <div class="">
                                        <label class="checkbox">
                                            <input type="radio" name="typeId" checked={typeId == type.id}  value={type.id} on:click={e => changeTypeId(e)}>
                                            {type.title}
                                        </label>
                                    </div>
                                </div>
                            {/each}                      
                            <p class="help is-danger">{checkErrors("typeId").message}</p>
                        </div>
       
                    </div>
                    <div class="field mt-3">
                        <label for class="label">انتخاب نظرسنجی</label>
                        <div class="box columns mt-3 mb-5 is-multiline is-tablet back-eee">
                            {#each surveys as survey}
                                <div class="column">
                                    <div class="">
                                        <label class="checkbox">
                                            <input type="radio" name="surveyId" checked={surveyId == survey.id}  value={survey.id} on:click={e => changeSurveyId(e)}>
                                            {survey.title}
                                        </label>
                                    </div>
                                </div>
                               
                            {/each}   
                            <p class="help is-danger">{checkErrors("surveyId").message}</p>                   
                        </div>
                    </div>

                    <div class="field is-grouped submit-parent" >
                            <button on:click={updateQuestion} class="button is-link">اعمال تغییرات</button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>


