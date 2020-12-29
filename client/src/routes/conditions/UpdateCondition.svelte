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
        getAnswersForCreateConditionFn, 
        getConditionFn
    } from '../../Api/conditionApi';
    import {loading} from '../../stores';
    import { onMount ,createEventDispatcher } from 'svelte';
    import { push , location } from 'svelte-spa-router';
    import Select from 'svelte-select';
    export let id = parseInt($location.split('/').slice(-1)[0]);
    export let questionId;
    export let consQuestionId;
    export let surveyId;
    export let answerId;
    export let criteriaId;
    export let condition;
    export let status;
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
        const result = await getConditionFn(id);
        if(result.status && data.status){
            surveys = data.surveys;
            criterias = data.criterias;
            condition = result.condition;
            surveyId = condition.consQuestion.surveyId;
            questionId = condition.questionId
            answerId = condition.answerId
            criteriaId = condition.criteriaId
            consQuestionId = condition.consQuestionId
            status = condition.status
        }else{
            replace('/server-error')
        }
        notLoading()
    })     
    const updateCondition = async () => {
        isLoading = true;
        const data = await createConditionFn({ questionId , answerId ,criteriaId , status , consQuestionId },id);

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
        condition.question = input.detail
    }
    const changeSurveyId = async(input) => {
        surveyId = parseInt(input.detail.id);
        const data = await getQuestionsForCreateConditionFn(surveyId);
        questions = data;
        consQuestions = data;
        condition.consQuestion.survey = input.detail
    }
    const changeAnswerId =  (input) => {
        answerId = parseInt(input.detail.id);
        condition.answer = input.detail
    }
    const changeConsQuestionId =  (input) => {
        consQuestionId = parseInt(input.detail.id);
        const ques = questions.filter(q => q.id === consQuestionId)[0];
        questions = questions.filter(q => q.turn < ques.turn);
        condition.consQuestion = input.detail
    }
    const changeCriteriaId =  (input) => {
        criteriaId = parseInt(input.detail.id);
        condition.criteria = input.detail
    }
    const clearSurveyId = (input) => {
        clearQuestionId()
    }
    const clearQuestionId = (input) => {

    }
</script>
<svelte:head>
	<title>ویرایش شرط</title>
</svelte:head>

<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
    {#if $loading}
        <progress class="progress is-small is-primary" max="100">15%</progress>
    {:else}
        <div class="p-2">
            <div class="columns is-variable is-desktop">
                <div class="column">
                    <h3 class="title text-center is-size-4">ویرایش شرط</h3>
                </div>
            </div>
            <div style="margin: auto;" class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                <div class="box">
                    <div style="margin: auto;" class="back-eee box column p-3 is-6-desktop is-offset-6-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                        <div class="field">
                            <label for="survey" class="label">انتخاب نظرسنجی : {condition?.consQuestion?.survey?.title}</label>
                            <Select 
                                items={surveys} 
                                {getSelectionLabel} 
                                {optionIdentifier} 
                                {getOptionLabel} 
                                on:select={changeSurveyId} 
                                on:clear={clearSurveyId}
                                noOptionsMessage="هیچگونه نظرسنجی فعالی جهت اعمال شرط وجود ندارد"
                                placeholder="جستجوی نظرسنجی..." 
                            />
                        </div>
                        <div class="field">
                            <label for="consQuestion" class="label">انتخاب سوال مد نظر : {condition?.consQuestion.title}</label>
                            <Select
                     
                                items={consQuestions} 
                                {getSelectionLabel} 
                                {optionIdentifier} 
                                {getOptionLabel} 
                                noOptionsMessage="هیچگونه سوال فعالی  برای این نظرسنجی جهت ایجاد شرط وجود ندارد"
                                on:select={changeConsQuestionId} 
                                on:clear={clearSurveyId}
                                placeholder="جستجوی سوال مد نظر..." 
                            />
                            <p class="help is-danger">{checkErrors("consQuestionId").message}</p>
                        </div>
                        <div class="field">
                            <label for="question" class="label">انتخاب سوال : {condition?.question.title}</label>
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
                            <label for="answer" class="label">انتخاب گزینه : {condition?.answer.title}</label>
                            <Select 
                                items={answers} 
                                {getSelectionLabel} 
                                {optionIdentifier} 
                                {getOptionLabel} 
                                on:select={changeAnswerId} 
                                noOptionsMessage="هیچگونه گزینه فعالی  برای این سوال جهت ایجاد شرط وجود ندارد"
                                placeholder="جستجوی گزینه..." 
                            />
                            <p class="help is-danger">{checkErrors("answerId").message}</p>
                        </div>
                        <div class="field">
                            <label for="criteria" class="label">انتخاب نوع شرط : {condition?.criteria.title}</label>
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
                    </div>
                    <div class="field is-grouped submit-parent" >
                        <button on:click={updateCondition} class="button is-link" class:is-loading={isLoading}>ذخیره</button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>