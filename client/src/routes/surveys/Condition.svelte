<script>
    import { onMount } from 'svelte';
    import { createConditionFn} from '../../Api/conditionApi';
    import {createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    export let consQuestionId;
    export let id;
    export let questionId;
    export let answerId;
    export let criteriaId;
    export let status = true;
    export let criterias;
    export let questions = [];
    export let answers = [];
    export let errorMessages = [];
    export let isLoading = false;  
    onMount(() => {
        if(questionId){
            answers = questions.filter(q => q.id === questionId)[0].answers
        }
    })
    const createAndEditCondition = async () => {
        isLoading = true;
        const data = await createConditionFn({ questionId , answerId ,criteriaId , status , consQuestionId } , id);
        if(data.status == true){
            dispatch('submit', {condition : data.condition , newCreate : id ? false : true});
            if(!id){
                questionId = undefined;
                answerId = undefined;
                criteriaId = undefined;
                status = true;
            }
        }else{
            errorMessages = data.errors;
        }
        setTimeout(() => {
            isLoading = false;
        },500)
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
    const changeAnswers = () => {
        
        if(questionId){
            answers = questions.filter(q => q.id === questionId)[0].answers
        }else{
            answers = []
        }
    }   
</script>
<style>
    .select {
        width: 100%;
    }
</style>
<div class="box">
    <div style="margin: auto;" class="back-eee box column p-3 is-6-desktop is-offset-6-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
        <div class="field">
            <label for="survey" class="label">سوال مد نظر</label>
            <div class="control has-icons-left">
                <div class="select">
                    <!-- svelte-ignore a11y-no-onchange -->
                    <select style="width:100%" bind:value={questionId} on:change={changeAnswers}>
                        {#if !questionId}
                            <option value="">انتخاب کنید</option>
                        {/if}
                        {#each questions.filter(q => q.typeId === 1 || q.typeId === 2) as question}
                            <option value={question.id} selected={questionId === question.id}>{question.title}</option>
                        {/each}
                    </select>
                </div>
                <div class="icon is-small is-left">
                    <i class="fas fa-tags"></i>
                </div>
            </div>
            <p class="help is-danger">{checkErrors("questionId").message}</p>
        </div>
        <div class="field">
            <label for="criteria" class="label">انتخاب نوع شرط</label>
            <div class="control has-icons-left">
                <div class="select">
                    <select style="width:100%" bind:value={criteriaId}>
                        {#if !criteriaId}
                            <option value="">انتخاب کنید</option>
                        {/if}
                        {#each criterias as criteria}
                            <option value={criteria.id} selected={criteriaId === criteria.id}>{criteria.title}</option>
                        {/each}
                    </select>
                </div>
                <div class="icon is-small is-left">
                    <i class="fas fa-tags"></i>
                </div>
            </div>
            <p class="help is-danger">{checkErrors("criteriaId").message}</p>
        </div>
        <div class="field">
            <label for="answer" class="label">انتخاب گزینه</label>
            <div class="control has-icons-left">
                <div class="select">
                    <select style="width:100%" bind:value={answerId}>
                        {#if !answerId}
                            <option value="">انتخاب کنید</option>
                        {/if}
                        {#each answers as answer}
                            <option value={answer.id} selected={answerId === answer.id}>{answer.title}</option>
                        {/each}
                    </select>
                </div>
            </div>
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
        <button on:click={createAndEditCondition} class="button is-link is-rounded" class:is-loading={isLoading}>{id ? "ویرایش" : "ذخیره"}</button>
    </div>
</div>