<script>
    import { fly, slide } from 'svelte/transition';
    import { notLoading } from '../../utilis/functions';
    import { createOrUpdateSurveyFn , getSurveyFn } from '../../Api/surveyApi';
    import { getTypesForCreateOrUpdateQuestionFn } from '../../Api/questionApi';
    import {loading} from '../../stores';
    import { onMount } from 'svelte';
    import { replace , location } from 'svelte-spa-router';
    import Input from '../../components/Input.svelte';
    import Toast from '../../components/Toast.svelte';
    import Question from './Question.svelte';
    import QuestionTable from './QuestionTable.svelte';
    export let id = parseInt($location.split('/').slice(-1)[0]);
    export let title = "";
    export let criterias = [];
    export let question = {
        id : undefined,
        title : undefined,
        turn : undefined,
        typeId : undefined,
        shouldBe : undefined,
        isUsedOk : undefined,
        surveyId : undefined,
        status : undefined,
        answers : [],
        conditions : []
    };
    export let status = true;
    export let questions = [];
    export let types = [];
    export let surveyId;
    export let showNewQuestionFormFlag = false;
    export let showEditQuestionFormFlag = false;
    export let errorMessages = [];
    export let isLoading = false;      
    export let editLoading = false; 
    export let addQuestionLoading = false;
    export let changeQuestion = false;       
    onMount( async () => {
        $loading = true;
        const result = await getSurveyFn(id,false);
        const d = await getTypesForCreateOrUpdateQuestionFn();
        if(d.status){
            types = d.types;
            criterias = d.criterias
        }
        if(!Number.isInteger(id)){
            replace('/not-found')
        } else if(result.status){
            
            const data = result.survey;
            status = data.status;
            title = data.title;
            questions = data.questions;
            surveyId = id;
        }else{
            replace('/not-found')
        }
        notLoading()
    })     
    const editSurvey = async () => {
        editLoading = true
        const data = await createOrUpdateSurveyFn({title , status } , surveyId);
        if(data.status == true){
            setTimeout(() => {
                editLoading = false;
                window.pushToast(`نظرسنجی موردنظر با موفقیت ویرایش شد`, "green")
            }, 500)
        }else{
            errorMessages = data.errors;
            isLoading = false;
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
    const onShowTable = async (e) => {
        const {newCreate} = e.detail;
        const qu = e.detail.question;
        if(!newCreate){
            showNewQuestionFormFlag = false;
            questions = questions.filter(q => q.id !== qu.id);
        }
        questions = [...questions, qu];
    }
    const showQuestionForm = () => {
        changeQuestion = false;
        question = {status : true , answers : [] , conditions : []}
        addQuestionLoading = true;
        showEditQuestionFormFlag = false;
        showNewQuestionFormFlag = !showNewQuestionFormFlag;
        setTimeout(() => {
            addQuestionLoading = false;
        }, 500)
    }
    const showEditQuestionForm = (e) => {
        changeQuestion = true;
        showNewQuestionFormFlag = false;
        showEditQuestionFormFlag = true;
        question = e.detail.question;
    }
</script>
<style>
    .main-button {
        margin-top: 3%;
        text-align: center;
    }
    .buttons{
      direction: ltr;
    }
    @media only screen and (max-width: 767px) {
        .buttons{
            direction: rtl;
        }
    }
    .margin-auto {
        margin: auto;
    }
</style>
<svelte:head>
	<title>ویرایش نظرسنجی</title>
</svelte:head>
<Toast />
<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
    {#if $loading}
        <progress class="progress is-small is-primary" max="100">15%</progress>
    {:else}
        <div class="p-2">
            <div class="columns is-variable is-desktop">
                <div class="column">
                    <h3 class="title is-size-4">ویرایش نظرسنجی</h3>
                </div>
                <div class="column navbar-end">
                    <div class="buttons">
                        <a href="#/surveys/show-survey/" class="button is-rounded is-danger">بازگشت</a> 
                    </div>
                </div>
            </div>
            <div style="margin: auto;" class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                <div class="box">
                    <div style="margin: auto;" class="back-eee box column p-3 is-6-desktop is-offset-6-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                        <Input errorClass={checkErrors("title").status} label="عنوان" placeholder="عنوان دسترسی؟" type="text" bind:title={title} icon="fa-heading" />
                        <p class="help is-danger">{checkErrors("title").message}</p>
                        <div class="field" style="direction: ltr;">
                            <div class="d-inlineblock status" >
                                <input id="status" type="checkbox" class="switch is-rounded is-info" bind:checked={status}>
                                <label for="status"></label>
                            </div>
                            <div class="d-inlineblock" style="position: relative; top: 5px">
                                <label for class="label">وضعیت</label> 
                            </div>
                        </div>
                    </div>
                    <div class="main-button">
                        <div class="field is-grouped submit-parent">
                            <button 
                                class:is-loading={editLoading} 
                                on:click={editSurvey} 
                                class="button is-info margin-auto is-rounded"
                                >
                                ویرایش
                            </button>
                            <button 
                                on:click={showQuestionForm} 
                                class:is-loading={addQuestionLoading} 
                                class={`button ${showNewQuestionFormFlag ? "is-danger" : "is-success"} margin-auto is-rounded`}
                            >
                                {showNewQuestionFormFlag ? "بستن فرم سوال" : "افزودن سوال"}
                            </button>
                        </div>
                    </div>
                    
                </div>
                {#if questions.length > 0 }
                    <div transition:slide|local={{duration : 500}}>
                        <QuestionTable bind:questions={questions} on:editQuestion={ (e) => showEditQuestionForm(e)} /> 
                    </div>
                {/if}
                {#if showNewQuestionFormFlag || showEditQuestionFormFlag }
                    <div transition:slide|local={{duration : 500}}>
                        <Question 
                            {surveyId} 
                            bind:id ={question.id}
                            bind:title={question.title}
                            bind:turn={question.turn}
                            bind:typeId={question.typeId}
                            bind:shouldBe={question.shouldBe}
                            bind:isUsedOk={question.isUsedOk}
                            bind:status={question.status}
                            bind:answers={question.answers}
                            bind:conditions={question.conditions}
                            bind:questions={questions}
                            bind:types={types}
                            bind:criterias={criterias}
                            bind:changeQuestion={changeQuestion}
                            on:submit={ (e) => onShowTable(e)} 
                        /> 
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>