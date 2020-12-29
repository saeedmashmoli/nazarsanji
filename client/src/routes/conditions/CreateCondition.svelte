<script>
    import { 
        notLoading ,
        optionIdentifier , 
        getOptionLabel , 
        getSelectionLabel
    } from '../../utilis/functions';
    import { createConditionFn, 
        getOptionsForCreateConditionFn,
        getQuestionsForCreateConditionFn,
        getAnswersForCreateConditionFn 
    } from '../../Api/conditionApi';
    import {loading} from '../../stores';
    import { onMount } from 'svelte';
    import { push } from 'svelte-spa-router';
    import Select from 'svelte-select';
    export let questionId;
    export let consQuestionId;
    export let surveyId;
    export let answerId;
    export let criteriaId;
    export let status = true;
    export let criterias = [];
    export let surveys = [];
    export let questions = [];
    export let consQuestions = [];
    export let answers = [];
    export let errorMessages = [];
    export let isLoading = false;        
    onMount( async() => {
        $loading = true;
        const data = await getOptionsForCreateConditionFn();
        if( data.status){
            surveys = data.surveys;
            criterias = data.criterias;
        }else{
            replace('/server-error')
        }
        notLoading()
    })     
    const createCondition = async () => {
        isLoading = true;
        const data = await createConditionFn({ questionId , answerId ,criteriaId , status , consQuestionId });
        if(data.status == true){
            push('/conditions/show-condition/')
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
    const changeQuestionId = async (input) => {
        questionId = parseInt(input.detail.id)
        const data = await getAnswersForCreateConditionFn(questionId);
        answers = data;
    }
    const changeSurveyId = async  (input) => {
        surveyId = parseInt(input.detail.id);
        const data = await getQuestionsForCreateConditionFn(surveyId);
        questions = data
        consQuestions = data;

    }
    const changeAnswerId =  (input) => {
        answerId = parseInt(input.detail.id);
    }
    const changeConsQuestionId =  (input) => {
        consQuestionId = parseInt(input.detail.id);
        const ques = questions.filter(q => q.id === consQuestionId)[0];
        questions = questions.filter(q => q.turn < ques.turn);
    }
    const changeCriteriaId =  (input) => {
        criteriaId = parseInt(input.detail.id);
    }
</script>
<svelte:head>
	<title>افزودن شرط</title>
</svelte:head>

<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
    {#if $loading}
        <progress class="progress is-small is-primary" max="100">15%</progress>
    {:else}
        <div class="p-2">
            <div class="columns is-variable is-desktop">
                <div class="column">
                    <h3 class="title text-center is-size-4">افزودن شرط</h3>
                </div>
            </div>
            <div style="margin: auto;" class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                <div class="box">
                    <div style="margin: auto;" class="back-eee box column p-3 is-6-desktop is-offset-6-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                        <div class="field">
                            <label for="survey" class="label">انتخاب نظرسنجی</label>
                            <Select 
                                items={surveys} 
                                {getSelectionLabel} 
                                {optionIdentifier} 
                                {getOptionLabel} 
                                on:select={changeSurveyId} 
                                noOptionsMessage="هیچگونه نظرسنجی فعالی جهت اعمال شرط وجود ندارد"
                                placeholder="جستجوی نظرسنجی..." 
                            />
                        </div>
                        <div class="field">
                            <label for="consQuestion" class="label">انتخاب سوال مدنظر</label>
                            <Select 
                                items={consQuestions} 
                                {getSelectionLabel} 
                                {optionIdentifier} 
                                {getOptionLabel} 
                                noOptionsMessage="هیچگونه سوال فعالی  برای این نظرسنجی جهت ایجاد شرط وجود ندارد"
                                on:select={changeConsQuestionId} 
                                placeholder="جستجوی سوال مد نظر..." 
                            />
                            <p class="help is-danger">{checkErrors("consQuestionId").message}</p>
                        </div>
                        <div class="field">
                            <label for="survey" class="label">انتخاب سوال</label>
                            <Select 
                                items={questions} 
                                {getSelectionLabel} 
                                {optionIdentifier} 
                                {getOptionLabel} 
                                noOptionsMessage="هیچگونه سوال فعالی  برای این نظرسنجی جهت ایجاد شرط وجود ندارد"
                                on:select={changeQuestionId} 
                                placeholder="جستجوی سوال..." 
                            />
                            <p class="help is-danger">{checkErrors("questionId").message}</p>
                        </div>
                        <div class="field">
                            <label for="criteria" class="label">انتخاب نوع شرط</label>
                            <Select 
                                items={criterias} 
                                {getSelectionLabel} 
                                {optionIdentifier} 
                                {getOptionLabel} 
                                on:select={changeCriteriaId} 
                                placeholder="جستجوی نوع شرط..." 
                            />
                            <p class="help is-danger">{checkErrors("criteriaId").message}</p>
                        </div>
                        <div class="field">
                            <label for="answer" class="label">انتخاب گزینه</label>
                            <Select 
                                items={answers} 
                                {getSelectionLabel} 
                                {optionIdentifier} 
                                {getOptionLabel} 
                                on:select={changeAnswerId} 
                                noOptionsMessage="هیچگونه گزینه فعالی  برای این سوال جهت ایجاد شرط وجود ندارد"
                                placeholder="جستجوی نوع شرط..." 
                            />
                            <p class="help is-danger">{checkErrors("answerId").message}</p>
                        </div>
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
                        </div>
                    </div>
                    <div class="field is-grouped submit-parent" >
                        <button on:click={createCondition} class="button is-link" class:is-loading={isLoading}>ذخیره</button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>